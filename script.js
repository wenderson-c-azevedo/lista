document.addEventListener('DOMContentLoaded', () => {
    const commentForm = document.getElementById('comment-form');
    const commentTextarea = document.getElementById('comment-text');
    const charCounter = document.getElementById('char-counter');
    const commentsList = document.getElementById('comments-list');
    const noCommentsMessage = document.getElementById('no-comments-message');

    const MAX_CHARS = 100;

    // Função para atualizar o contador de caracteres
    const updateCharCounter = () => {
        const currentLength = commentTextarea.value.length;
        charCounter.textContent = `${currentLength}/${MAX_CHARS}`;
    };

    // Função para carregar e exibir comentários do LocalStorage
    const loadComments = () => {
        const comments = JSON.parse(localStorage.getItem('comments')) || [];
        commentsList.innerHTML = ''; // Limpa a lista atual

        if (comments.length === 0) {
            noCommentsMessage.style.display = 'block';
        } else {
            noCommentsMessage.style.display = 'none';
            // Ordena do mais recente para o mais antigo
            comments.sort((a, b) => b.timestamp - a.timestamp);
            comments.forEach(comment => displayComment(comment));
        }
    };

    // Função para exibir um único comentário
    const displayComment = (comment) => {
        const commentDiv = document.createElement('div');
        commentDiv.classList.add('comment-item');
        commentDiv.setAttribute('role', 'comment');

        const commentParagraph = document.createElement('p');
        commentParagraph.textContent = comment.text;
        commentDiv.appendChild(commentParagraph);

        const date = new Date(comment.timestamp);
        const dateOptions = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        const timeSpan = document.createElement('span');
        timeSpan.classList.add('text-muted', 'small');
        timeSpan.textContent = `Postado em: ${date.toLocaleDateString('pt-BR', dateOptions)}`;
        commentDiv.appendChild(timeSpan);

        commentsList.appendChild(commentDiv);
    };

    // Event Listener para o formulário de comentário
    commentForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const commentText = commentTextarea.value.trim();

        if (commentText.length === 0) {
            alert('Por favor, digite um comentário antes de enviar.');
            return;
        }

        if (commentText.length > MAX_CHARS) {
            alert(`O comentário não pode exceder ${MAX_CHARS} caracteres.`);
            return;
        }

        const newComment = {
            text: commentText,
            timestamp: Date.now() // Salva o timestamp para ordenação
        };

        const comments = JSON.parse(localStorage.getItem('comments')) || [];
        comments.push(newComment);
        localStorage.setItem('comments', JSON.stringify(comments));

        commentTextarea.value = ''; // Limpa o textarea
        updateCharCounter(); // Atualiza o contador
        loadComments(); // Recarrega e exibe os comentários

        // Anuncia a nova entrada para leitores de tela
        const announcement = `Novo comentário adicionado: ${newComment.text.substring(0, 50)}...`;
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.classList.add('visually-hidden'); // Esconde visualmente, mas acessível
        liveRegion.textContent = announcement;
        document.body.appendChild(liveRegion);
        setTimeout(() => liveRegion.remove(), 1000); // Remove após um curto período
    });

    // Event Listener para o contador de caracteres em tempo real
    commentTextarea.addEventListener('input', updateCharCounter);

    // Carrega os comentários ao iniciar a página
    loadComments();
    updateCharCounter(); // Inicializa o contador
});
