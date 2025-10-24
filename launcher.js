document.addEventListener('DOMContentLoaded', function() {
    const icons = document.querySelectorAll('.icon');
    const playButton = document.querySelector('.play-button');
    const background = document.getElementById('background');

    // funcion para abrir mc en servers
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

    // funcion error
    function showMinecraftError() {
        alert('Could not find Minecraft Bedrock.\n\nMake sure:\n• Minecraft Bedrock is installed\n• You are using Windows 10/11\n• The app is installed from Microsoft Store');
    }

    //funcion cambiar fondo
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
            }, 500);
        }
    }

    // listener para iconos
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

    // event listener abrir mc
    playButton.addEventListener('click', openMinecraft);
});

