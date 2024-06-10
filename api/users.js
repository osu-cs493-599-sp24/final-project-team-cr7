const router = require('express').Router();

// [INFO] '/' a.k.a the root path is actually '/users'

const checkID = (id) => {
    // Convert the ID to a number
    id = Number(id);
    if (typeof id === 'number' && id >= 0 && Number.isInteger(id)) {
        return false;
    } else {
        // [TODO) Check if the ID exists in the database
        return true;
    }
};

const getUser = (id) => {
    // [TODO) Get the user from the database
    return {
        id: id,
        name: 'John Doe',
        email: 'john@doe.com',
        password: 'password',
        role: 'student',
        courses: [0, 1, 2],
    };
};

/*
 * Returns information about the specified User.
 *
 * If the User has the 'instructor' role, the response should include a list of
 * the IDs of the Courses the User teaches (i.e. Courses whose instructorId field
 * matches the ID of this User).
 *
 * If the User has the 'student' role, the response should include a list of the
 * IDs of the Courses the User is enrolled in. Only an authenticated User whose
 * ID matches the ID of the requested User can fetch this information.
 */
router.get('/:id', (req, res) => {
    const authenticatedUser = {
        id: 0,
        role: 'student',
    };

    const userId = req.params.id;

    // Check if the User is authorized to access the information
    if (userId !== authenticatedUser.id.toString()) {
        res.status(403).send({
            error: 'User is not authorized to access this information',
        });
        return;
    }

    // Check if the ID exists
    if (checkID(userId)) {
        res.status(404).send({
            error: 'User ID does not exist',
        });
        return;
    }

    // Get the user from the database
    const user = getUser(userId);
    res.status(200).send(user);
    return;
});

/*
 * Create and store a new application User with specified data and adds it to the
 * application's database. Only an authenticated User with 'admin' role can create
 * users with the 'admin' or 'instructor' roles.
 */
router.post('/', (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const role = req.body.role;

    const missingFields = {
        name: !name,
        email: !email,
        password: !password,
        role: !role,
    };

    if (
        missingFields.name ||
        missingFields.email ||
        missingFields.password ||
        missingFields.role
    ) {
        res.status(400).send({
            error: 'Missing fields',
            missing: missingFields,
        });
        return;
    }

    const authenticatedUser = {
        id: 0,
        role: 'instructor',
    };

    if (authenticatedUser.role !== 'admin' && role !== 'student') {
        switch (role) {
            case 'admin':
                res.status(403).send({
                    error: 'User is not authorized to create this role',
                });
                return;
            case 'instructor':
                res.status(403).send({
                    error: 'User is not authorized to create this role',
                });
                return;
            case 'student':
                break;
            default:
                res.status(400).send({
                    error: 'Invalid role',
                    role: role,
                });
                return;
        }
    }

    // [TODO) Create the user in the database
    res.status(201).send({
        id: 0,
        name: name,
        email: email,
        role: role,
    });
});

/*
 * Authenticate a specific User with their email address and password.
 */
router.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password) {
        res.status(400).send({
            error: 'Missing fields',
            missing: {
                email: !email,
                password: !password,
            },
        });
        return;
    }

    // [TODO) Check if the email and password match 401 if they don't

    // [TODO) Authenticate the user
    res.status(200).send({
        id: 0,
        token: 'sdfjskldfjfsldkfjslkfj',
    });
});

module.exports = router;
