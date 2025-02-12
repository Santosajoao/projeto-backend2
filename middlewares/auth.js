const jwt = require('jsonwebtoken')

// Função que verifica o token pelo cabeçalho da URL
const verifyToken = (req, res, next) => {
    // Recebe o autenticador pelo cabeçalho usando a chave 'authorization'
    const authHeader = req.headers['authorization'];

    // Realiza a separação da string do authHeader
    const token = authHeader && authHeader.split(' ')[1];

    // Se o token for vazio, chamará erro 401 de acesso negado
    if (!token) {
        return res.status(401).json({ message: 'Acesso negado' });
    }

    // Verifica o token utilizando a chave do arquivo env
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) {
            // Se o token não existir ou não for válido, acionará o erro 403
            return res.status(403).json({ message: 'Token inválido!' });
        }

        try {
            // Busca o usuário no banco de dados pelo ID contido no token
            const user = await User.findByPk(decoded.id);
            if (!user) {
                return res.status(404).json({ message: 'Usuário não encontrado' });
            }

            // Adiciona o usuário ao objeto req para uso posterior
            req.user = user;
            next(); // Chama o próximo middleware ou função de rota
        } 
        
        catch (error) {
            return res.status(500).json({ message: 'Erro ao buscar usuário' });
        }
    });
};


//Função para verificar se no token contém a informação se o usuário é administrador ou não
const isAdm = (req, res, next) => {
    // Verifica se o usuário é administrador
    if (!req.user.isAdm) {
        return res.status(403).json({ message: 'Acesso negado: apenas administradores podem realizar a ação' });
    }

    // Se o usuário for administrador, segue para a próxima função
    next();
};


//Função para caso não encontre a rota especificada
const urlNotValid = (req, res, next) => {
    res.status(404).json({message: "Rota não existente"})
}



module.exports = { verifyToken, isAdm, urlNotValid }
