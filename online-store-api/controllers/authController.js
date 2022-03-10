const registerUser = async (req, res) => {
	res.send('register');
};

const loginUser = async (req, res) => {
	res.send('login');
};

const logoutUser = async (req, res) => {
	res.send('logout');
};

module.exports = { registerUser, loginUser, logoutUser };
