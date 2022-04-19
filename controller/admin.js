
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Admin = require('../models/Admin');
const { getToken } = require('../configuration/token');
const Book = require("../models/Book");
const BookStore = require("../models/BookStore");
const BookImport = require("../models/BookImport");
const Librarian = require('../models/Librarian');

exports.adminSignup = async (req, res) => {
    try {


        const { firstName, lastName, email, mobile, password } = req.body;

        const type = "ADMIN";

        if (!firstName || !lastName || !email || !mobile || !password || !type) {
            return res.status(200).json({
                adminSignUp: false,
                code: "API_CALLING_ERROR",
            })
        }


        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newAdmin = new Admin({
            firstName, lastName, email, mobile, password: hashedPassword, type
        })

        const admin = await newAdmin.save();

        if (!admin) {
            return res.status(200).json({
                adminSignUp: false,
                code: "ADMIN_SAVE_ERROR",
            })
        }

        return res.status(200).json({
            adminSignUp: true,
            code: "SIGNUP_SUCCESSFULLY",
        })

    } catch (error) {
        return res.status(400).json({
            adminSignUp: false,
            code: "API_CALLING_ERROR",
            error
        })
    }
}
// firstName,lastName,email,password,mobile <-- body


exports.adminLogin = async (req, res) => {
    try {


        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(200).json({
                login: false,
                code: "MISSING_BODY_DATA",
            })
        }


        const isAdmin = await Admin.findOne({ email: email });
        if (!isAdmin) {
            return res.status(200).json({
                login: false,
                code: "EMAIL IS NOT REGISTERED",
            })
        }

        const isPasswordOk = await bcrypt.compare(password, isAdmin.password);
        if (isPasswordOk) {

            // generating token
            const token = getToken(isAdmin);

            return res.status(200).header({
                "authorization": token
            }).json({
                login: true,
                code: "LOGIN_SUCCESSFULLY",
            })
        } else {
            return res.status(200).json({
                login: false,
                code: "WRONG EMAIL OR PASSWORD",
            })
        }

    } catch (error) {
        return res.status(400).json({
            login: false,
            code: "API_CALLING_ERROR",
        })
    }
}
// email,password <-- body

exports.changePassword = async (req, res) => {
    try {

        const { email, password, newPassword } = req.body;

        if (!email || !password) {
            return res.status(200).json({
                status: false,
                code: "BODY_DATA_MISSING",
            })
        }

        const isAdmin = await Admin.findOne({ email: email });
        if (!isAdmin) {
            return res.status(200).json({
                status: false,
                code: "UNREGISTERED EMAIL",
            })
        }

        if (! await bcrypt.compare(password, isAdmin.password)) {
            return res.status(200).json({
                status: false,
                code: "OLD WRONG PASSWORD",
            })
        }

        const hashedPassword = await bcrypt.hash(newPassword, bcrypt.genSaltSync(10));

        const changedPassword = await Admin.updateOne({ email: email }, {
            password: hashedPassword
        })

        if (!changedPassword) {
            return res.status(200).json({
                status: false,
                code: "ERROR OCCURED WHILE CHANGING PASSWORD",
            })
        }

        return res.status(200).json({
            status: true,
            code: "PASSWORD IS CHANGED SUCCESSFULLY",
        })


    } catch (error) {
        return res.status(200).json({
            status: false,
            code: "API_CALLING_ERROR",
        })
    }
}
// email,password,newPassword <-- body

exports.checkingBookCode = async (req, res) => {
    try {

        const { bookCode } = req.body;
        if (!bookCode) {
            return res.status(200).json({
                status: false,
                code: "BODY_DATA_MISSING",
            })
        }


        const book = await Book.findOne({ bookCode: bookCode });
        if (!book) {
            return res.status(200).json({
                status: false,
                code: "BOOK IS NOT FOUND",
            })
        }

        return res.status(200).json({
            status: true,
            code: "BOOK IS FOUND",
        })
    } catch (error) {
        return res.status(200).json({
            status: false,
            code: "API_CALLING_ERROR",
        })
    }
}
exports.importBooks = async (req, res) => {


    let { bookCode, quantity } = req.body;

    quantity=parseInt(quantity);
    
    const book = await Book.findOne({ bookCode: bookCode });
    if (!book) {

        try {
            // NEW BOOK REGISTRATION
            const { title, author, price } = req.body;

            const newBookEntry = new Book({
                bookCode, title, author, price
            })

            const newBookImport = new BookImport({
                bookCode: newBookEntry.bookCode,
                quantity: quantity
            })

            const newBookStore = new BookStore({
                bookCode: newBookEntry.bookCode,
                totalQuantity: quantity,
                issueQuantity: 0
            })

            await newBookEntry.save();
            await newBookImport.save();
            await newBookStore.save();

            return res.status(200).json({
                status:true,
                code: "IMPORTED_NEW",
            })

        } catch (error) {
            return res.status(400).json({
                status: false,
                code: "API_CALLING_ERROR1",
            })
        }

    } else {

        try {


            // EXISTING BOOK REGISTRATION OR IMPORT
            const newBookImport = new BookImport({
                bookCode: book.bookCode,
                quantity: quantity
            })
            await newBookImport.save();

            const prevBookStore = await BookStore.findOne({ bookCode: book.bookCode });

            await BookStore.findOneAndUpdate({
                bookCode: book.bookCode
            }, {
                totalQuantity: prevBookStore.totalQuantity + quantity
            })


            return res.status(200).json({
                status:true,
                code: "IMPORTED_EXISTING",
            }) 

        } catch (error) {
            return res.status(400).json({
                status: false,
                code: "API_CALLING_ERROR2",
            })
        }
    }



}


exports.registerNewLibrarian = async (req, res) => {
    try {
        const { firstName, lastName, email, mobile, password } = req.body;
        if (!firstName || !lastName || !email || !mobile || !password) {
            return res.status(200).json({
                status: false,
                code: "MISSING_BODY_DATA",
            })
        }

        const hashedPassword = await bcrypt.hash(password, bcrypt.genSaltSync(10));
        try {

            const newLibrarian = new Librarian({
                firstName, lastName, email, password: hashedPassword, mobile,
                type: "LIBRARIAN"
            })

            await newLibrarian.save();
        } catch (error) {
            return res.status(200).json({
                status:false,
                code: "DUPLICATE_EMAIL",
            })
        }
        return res.status(200).json({
            status: true,
            code: "LIBRARIAN IS REGISTERED SUCCESSFULLY",
        })
    } catch (error) {
        return res.status(400).json({
            status: "ERROR",
            code: "API_CALLING_ERROR",
        })
    }
}

exports.getAdminData=async(req,res)=>{

    try {
        
        const admin= await Admin.findById({_id:req.user.ID});
        let data={...admin}

        data={...data._doc,password:null}
        

        return res.status(200).json(data);

    } catch (error) {
        return res.status(400).json({
            status: "ERROR",
            code: "API_CALLING_ERROR",
        })
    }
    

}