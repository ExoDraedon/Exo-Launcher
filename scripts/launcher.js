document.addEventListener('DOMContentLoaded', function() {
    const icons = document.querySelectorAll('.icon');
    const playButton = document.querySelector('.play-button');
    const background = document.getElementById('background');
    let currentColor = '#6a11cb';
    let activeIcon = document.querySelector('.icon.active');
    
    // Función para cambiar el fondo con transición mejorada
    function changeBackground(bgUrl) {
        background.classList.add('transitioning');
        
        setTimeout(() => {
            background.style.backgroundImage = `url('${bgUrl}')`;
            
            setTimeout(() => {
                background.classList.remove('transitioning');
            }, 400);
        }, 400);
    }
    
    // Función para actualizar el color del botón
    function updateButtonColor() {
        playButton.style.background = `linear-gradient(135deg, ${currentColor} 0%, ${lightenColor(currentColor, 20)} 100%)`;
        
        const style = document.createElement('style');
        style.innerHTML = `
            @keyframes pulse {
                0% {
                    box-shadow: 0 0 0 0 ${currentColor}7F;
                }
                70% {
                    box-shadow: 0 0 0 10px ${currentColor}00;
                }
                100% {
                    box-shadow: 0 0 0 0 ${currentColor}00;
                }
            }
        `;
        
        const existingStyle = document.getElementById('pulse-animation-style');
        if (existingStyle) {
            existingStyle.remove();
        }
        
        style.id = 'pulse-animation-style';
        document.head.appendChild(style);
        
        playButton.classList.remove('pulse-animation');
        void playButton.offsetWidth;
        playButton.classList.add('pulse-animation');
    }
    
    // Función para aclarar un color
    function lightenColor(color, percent) {
        const num = parseInt(color.replace("#", ""), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) + amt;
        const G = (num >> 8 & 0x00FF) + amt;
        const B = (num & 0x0000FF) + amt;
        
        return "#" + (
            0x1000000 +
            (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
            (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
            (B < 255 ? B < 1 ? 0 : B : 255)
        ).toString(16).slice(1);
    }
    
    // Función para ejecutar Minecraft Bedrock
    function launchMinecraft() {
        // Rutas comunes de Minecraft Bedrock en Windows
        const minecraftPaths = [
            // Windows 10/11 - Instalación desde Microsoft Store
            "shell:AppsFolder\\Microsoft.MinecraftUWP_8wekyb3d8bbwe!App",
            // Ruta alternativa común
            "C:\\Program Files\\WindowsApps\\Microsoft.MinecraftUWP_*\\Minecraft.Windows.exe",
            // Para usuarios que usan la versión de Xbox App
            "shell:AppsFolder\\Microsoft.4297127D64EC6_8wekyb3d8bbwe!App",
            // Ruta de respaldo usando el protocolo minecraft:
            "minecraft:"
        ];
        
        // Intentar ejecutar Minecraft
        let minecraftLaunched = false;
        
        for (const path of minecraftPaths) {
            try {
                if (path.startsWith("shell:") || path.startsWith("minecraft:")) {
                    // Usar el protocolo para aplicaciones UWP
                    window.open(path.replace("shell:", ""), "_self");
                } else {
                    // Para ejecutables tradicionales
                    const { exec } = require('child_process');
                    exec(`start "" "${path}"`, (error, stdout, stderr) => {
                        if (error) {
                            console.log(`Error al ejecutar Minecraft: ${error}`);
                            return;
                        }
                    });
                }
                minecraftLaunched = true;
                console.log(`Minecraft ejecutado desde: ${path}`);
                break;
            } catch (error) {
                console.log(`No se pudo ejecutar desde ${path}: ${error}`);
                continue;
            }
        }
        
        if (!minecraftLaunched) {
            // Si no se pudo ejecutar, mostrar mensaje al usuario
            alert('No se pudo encontrar Minecraft Bedrock.\n\nAsegúrate de que:\n• Minecraft Bedrock esté instalado\n• Estés usando Windows 10/11\n• La aplicación esté instalada desde Microsoft Store');
        }
    }
    
    // Añadir eventos a los iconos
    icons.forEach(icon => {
        icon.addEventListener('mouseenter', function() {
            if (!this.classList.contains('active')) {
                this.style.transform = 'translateX(15px)';
            }
            
            const color = this.getAttribute('data-color');
            if (color) {
                currentColor = color;
                updateButtonColor();
            }
            
            const bgUrl = this.getAttribute('data-bg');
            if (bgUrl) {
                changeBackground(bgUrl);
            }
        });
        
        icon.addEventListener('mouseleave', function() {
            if (!this.classList.contains('active')) {
                this.style.transform = 'translateX(0)';
            }
        });
        
        icon.addEventListener('click', function() {
            icons.forEach(i => {
                i.classList.remove('active');
                if (i !== this) {
                    i.style.transform = 'translateX(0)';
                }
            });
            
            this.classList.add('active');
            this.style.transform = 'translateX(15px)';
            activeIcon = this;
            
            const color = this.getAttribute('data-color');
            if (color) {
                currentColor = color;
                updateButtonColor();
            }
            
            const bgUrl = this.getAttribute('data-bg');
            if (bgUrl) {
                changeBackground(bgUrl);
            }
        });
    });
    
    // Inicializar el botón con el color por defecto
    updateButtonColor();
    
    // Evento para el botón de jugar - EJECUTAR MINECRAFT
    playButton.addEventListener('click', function() {
        // Cambiar texto del botón temporalmente
        const originalText = playButton.textContent;
        playButton.textContent = 'INICIANDO...';
        playButton.disabled = true;
        
        // Ejecutar Minecraft
        launchMinecraft();
        
        // Restaurar botón después de 3 segundos
        setTimeout(() => {
            playButton.textContent = originalText;
            playButton.disabled = false;
        }, 3000);
    });
});
