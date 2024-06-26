const { registerUser, authenticateUser } = require('../services/userService');

// Controller for registering a patient
exports.registerPatient = async (req, res) => {
    const { email, password, firstName, lastName, dob, telephone } = req.body;
    const userData = {
        email,
        password,
        firstName,
        lastName,
        dob,
        telephone,
        role: 'patient'
    };

    const result = await registerUser(userData);
    if (result.success) {
        res.status(201).send({ error: false, message: 'Patient registered successfully', data: result.uid });
    } else {
        res.status(500).send({ error: true, message: result.message });
    }
};

// Controller for registering a doctor (admin role required)
exports.registerDoctor = async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).send({ error: true, message: 'Only admin can register doctors.' });
    }

    const { email, password, firstName, lastName, dob, telephone, category } = req.body;

    category = category || 'general';

    const userData = {
        email,
        password,
        firstName,
        lastName,
        dob,
        telephone,
        category,
        role: 'doctor'
    };

    const result = await registerUser(userData);
    if (result.success) {
        res.status(201).send({ error: false, message: 'Doctor registered successfully', data: result.uid });
    } else {
        res.status(500).send({ error: true, message: result.message });
    }
};

// Controller for user login
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    const result = await authenticateUser(email, password);
    if (result.success) {
        console.log(result)
        res.status(200).send({ error: false, data: {token: result.token, role: result.role} });
    } else {
        res.status(401).send({ error: true, message: 'Authentication failed' });
    }
};
