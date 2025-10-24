document.addEventListener('DOMContentLoaded', function() {
    const icons = document.querySelectorAll('.icon');
    const playButton = document.querySelector('.play-button');
    const background = document.getElementById('background');

    // Colores de acento para cada fondo (puedes ajustar estos valores)
    const accentColors = {
        'bg1.png': 'rgba(106, 17, 203, 0.3)',  // Púrpura
        'bg2.png': 'rgba(37, 117, 252, 0.3)',  // Azul
        'bg3.png': 'rgba(252, 37, 37, 0.3)'    // Rojo
    };

    // ========== 🎮 FUNCIÓN PARA ABRIR MINECRAFT EN SERVIDORES ==========
    function openMinecraft() {
        const originalText = playButton.textContent;
        playButton.textContent = 'Starting...';
        playButton.disabled = true;

        // URL para abrir directamente en la pestaña de servidores
        const url = "minecraft://openServersTab";
        
        setTimeout(() => {
            try {
                // Método confiable para abrir Minecraft en servidores
                window.open(url, '_blank');
                window.open(url, '_self');
                
                console.log('Minecraft Bedrock abriendo en servidores');
            } catch (error) {
                console.log('Error al abrir Minecraft:', error);
                showMinecraftError();
            }

            // Restaurar botón después de 2 segundos
            setTimeout(() => {
                playButton.textContent = originalText;
                playButton.disabled = false;
                playButton.blur();
            }, 2000);
        }, 1000);
    }

    // ========== 🚨 FUNCIÓN DE ERROR ==========
    function showMinecraftError() {
        alert('Could not find Minecraft Bedrock.\n\nMake sure:\n• Minecraft Bedrock is installed\n• You are using Windows 10/11\n• The app is installed from Microsoft Store');
    }

    // ========== 🌈 FUNCIÓN PARA CAMBIAR FONDO Y COLOR DE ACENTO ==========
    function changeBackground(bgUrl) {
        // Solo cambiar si es una URL diferente
        if (background.style.backgroundImage !== `url('${bgUrl}')`) {
            // Fade out
            background.style.opacity = '0';
            
            // Cambiar imagen después del fade out
            setTimeout(() => {
                background.style.backgroundImage = `url('${bgUrl}')`;
                // Fade in
                background.style.opacity = '1';
                
                // Actualizar el color de acento basado en el fondo
                updateAccentColor(bgUrl);
            }, 500);
        }
    }

    // ========== 🎨 FUNCIÓN PARA ACTUALIZAR COLOR DE ACENTO ==========
    function updateAccentColor(bgUrl) {
        // Extraer el nombre del archivo de fondo
        const bgName = bgUrl.split('/').pop();
        
        // Obtener el color de acento correspondiente
        const accentColor = accentColors[bgName] || 'rgba(100, 100, 255, 0.3)';
        
        // Actualizar la variable CSS
        document.documentElement.style.setProperty('--glass-glow', accentColor);
    }

    // ========== 🖱️ EVENT LISTENERS PARA ICONOS ==========
    icons.forEach(icon => {
        icon.addEventListener('mouseenter', function() {
            if (!this.classList.contains('active')) {
                this.style.transform = 'translateX(15px)';
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
            
            const bgUrl = this.getAttribute('data-bg');
            if (bgUrl) {
                changeBackground(bgUrl);
            }
        });
    });

    // ========== 🎯 EVENT LISTENER PARA EL BOTÓN DE PLAY ==========
    playButton.addEventListener('click', openMinecraft);

    // ========== 🚀 INICIALIZACIÓN ==========
    // Establecer color de acento inicial
    const activeIcon = document.querySelector('.icon.active');
    if (activeIcon) {
        const initialBg = activeIcon.getAttribute('data-bg');
        updateAccentColor(initialBg);
    }
});