const { registerUser, authenticateUser, getAuthenticateUser } = require('../services/userService');

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

    console.log('patient creating')

    const result = await registerUser(userData);
    if (result.error) {
        res.status(500).send({ error: true, message: result.message });
    } else {
        res.status(201).send({ error: false, message: 'Patient registered successfully', data: result.uid });
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
    if (result.error) {
        res.status(500).send({ error: true, message: result.message });
        
    } else {
        res.status(201).send({ error: false, message: 'Doctor registered successfully', data: result.uid });
    }
};

// Controller for user login
exports.getLoginUser = async (req, res) => {
    const { id } = req.params;
    const result = await getAuthenticateUser(id);
    console.log(result)
    if (result.error) {
        res.status(401).send({ error: true, message: result.message });
        
    } else {
        res.status(200).send({ error: false, data: {id: result.id, role: result.role, email: result.email, firstName: result.firstName} });
    }
};
