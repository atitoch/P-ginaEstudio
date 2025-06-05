import subprocess
import os
import re

def get_current_branch():
    """Obtiene la rama actual del repositorio"""
    try:
        result = subprocess.run(['git', 'branch', '--show-current'], 
                              capture_output=True, text=True, check=True)
        return result.stdout.strip()
    except subprocess.CalledProcessError:
        return None

def get_last_merged_me_number():
    """Obtiene el último número ME que fue mergeado a main"""
    try:
        # Primero, asegurarse de tener la última versión de main
        subprocess.run(['git', 'fetch', 'origin', 'main'], 
                      capture_output=True, text=True, check=True)
        
        # Obtener el historial de commits mergeados en main
        result = subprocess.run(['git', 'log', 'origin/main', '--oneline', '--grep=Merge.*ME-'], 
                              capture_output=True, text=True, check=True)
        
        # Si no hay merges con patrón ME-, buscar en los commits directos
        if not result.stdout.strip():
            result = subprocess.run(['git', 'log', 'origin/main', '--oneline'], 
                                  capture_output=True, text=True, check=True)
        
        commits = result.stdout.strip().split('\n')
        
        # Buscar el último número ME en los commits
        me_numbers = []
        for commit in commits:
            if commit.strip():
                # Buscar patrón ME-número en el mensaje de commit
                match = re.search(r'ME-(\d+)', commit)
                if match:
                    me_numbers.append(int(match.group(1)))
        
        # Retornar el número más alto encontrado
        return max(me_numbers) if me_numbers else 13  # Default a 13 como mencionaste
        
    except subprocess.CalledProcessError:
        return 13  # Default si hay error

def run_git_command(command):
    """Ejecuta un comando de git y maneja errores"""
    try:
        result = subprocess.run(command, shell=True, check=True, 
                              capture_output=True, text=True)
        print(f"✅ {command}")
        if result.stdout:
            print(f"   {result.stdout.strip()}")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Error ejecutando: {command}")
        if e.stderr:
            print(f"   {e.stderr.strip()}")
        return False

def main():
    # Verificar que estemos en un repositorio git
    if not os.path.exists('.git'):
        print("❌ No estás en un repositorio Git")
        return
    
    print("🚀 Script de Git Automation")
    print("=" * 40)
    
    # Obtener la rama actual
    current_branch = get_current_branch()
    print(f"📍 Rama actual: {current_branch}")
    
    # Obtener el último número mergeado y calcular el siguiente
    last_merged = get_last_merged_me_number()
    next_number = last_merged + 1
    new_branch = f"ME-{next_number}"
    
    print(f"🔍 Último ME mergeado en main: ME-{last_merged}")
    print(f"🌿 Nueva rama a crear: {new_branch}")
    
    # Confirmar con el usuario
    confirm = input(f"\n¿Deseas continuar con la rama {new_branch}? (y/n): ")
    if confirm.lower() != 'y':
        print("❌ Operación cancelada")
        return
    
    # Solicitar mensaje de commit
    commit_message = input("\n💬 Ingresa el mensaje de commit: ")
    if not commit_message.strip():
        print("❌ El mensaje de commit no puede estar vacío")
        return
    
    print(f"\n🔄 Ejecutando comandos Git...")
    print("-" * 40)
    
    # 2. Crear y cambiar a nueva rama desde main
    if not run_git_command(f"git checkout -b {new_branch}"):
        return
    
    # 3. Agregar todos los archivos
    if not run_git_command("git add ."):
        return
    
    # 4. Hacer commit
    if not run_git_command(f'git commit -m "{commit_message}"'):
        return
    
    # 5. Push a la nueva rama
    if not run_git_command(f"git push origin {new_branch}"):
        return
    
    print("\n" + "=" * 40)
    print(f"✅ ¡Proceso completado exitosamente!")
    print(f"🌿 Rama creada: {new_branch}")
    print(f"💬 Commit: {commit_message}")
    print(f"🚀 Push realizado a origin/{new_branch}")
    print(f"📝 Ahora puedes crear un Pull Request para mergear a main")

if __name__ == "__main__":
    main()