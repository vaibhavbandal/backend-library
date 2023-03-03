const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Admin = require('../models/Admin');
const Student = require("../models/Student");
const Book = require("../models/Book");
const BookIR = require("../models/BookIR");
const { getToken } = require('../configuration/token');


exports.login = async (req, res) => {
    try {


        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(200).json({
                login: false,
                code: "MISSING_BODY_DATA",
            })
        }


        const isStudent = await Student.findOne({ email: email });
        if (!isStudent) {
            return res.status(200).json({
                login: false,
                code: "EMAIL IS NOT REGISTERED",
            })
        }

        const isPasswordOk = await bcrypt.compare(password, isStudent.password);
        if (isPasswordOk) {

            // generating token
            const token = getToken(isStudent);

            return res.status(200).header({
                "Authorization": token
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
        return res.status(200).json({
            login: false,
            code: "API_CALLING_ERROR",
        })
    }
}

exports.changePassword = async (req, res) => {

    try {

        const { email, password, newPassword } = req.body;

        if(email==='gueststudent@gmail.com'){
            return res.status(200).json({
                status: false,
                code: "GUEST_CANNOT_RESET_PASSWORD!",
            })
        }

        if (!email || !password || !newPassword) {
            return res.status(200).json({
                status: false,
                code: "BODY_DATA_MISSING",
            })
        }

        const isStudent = await Student.findOne({ email: email });
        if (!isStudent) {
            return res.status(400).json({
                status: false,
                code: "UNREGISTERED EMAIL",
            })
        }

        if (! await bcrypt.compare(password, isStudent.password)) {
            return res.status(400).json({
                status: false,
                code: "WRONG PASSWORD",
            })
        }

        const hashedPassword = await bcrypt.hash(newPassword, bcrypt.genSaltSync(10));

        const changedPassword = await Student.updateOne({ email: email }, {
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

exports.studentActiveBook = async (req, res) => {


    const studentId = req.user.ID;
    const email = req.user.email;
    try {

        const student = await Student.findOne({ email: email });

        if (!(student.bookStatus)) {
            return res.status(200).json({
                bookStatus: false,
                code: "BOOK_NOT_ISSUED",
            })
        }

        const book = await Book.findOne({ bookCode: student.bookCode });

        return res.status(200).json({
            bookStatus: true,
            book: book
        })
    } catch (error) {
        return res.status(400).json({
            bookStatus: false,
            code: "API_CALLING_ERROR",
            error
        })
    }

}

exports.studentIssueReturnHistory = async (req, res) => {
    const email = req.user.email;
    const studentId = req.user.ID;

    const student = await Student.findOne({ email: email });

        if (!(student)) {
            return res.status(200).json({
                status: false,
                code: "STUDENT_NOT_FOUND",
            })
        }


        const bookIRHistory=await BookIR.find({student:studentId});

        console.log(bookIRHistory);

        return res.status(200).json({
            status: true,
            bookIRHistory
        })
}


exports.getStudentData=async(req,res)=>{
    try {
        const student= await Student.findById({_id:req.user.ID});
        let data={...student}

        data={...data._doc,password:null}
        

        return res.status(200).json(data);

    } catch (error) {
        return res.status(401).json({
            status: "ERROR",
            code: "API_CALLING_ERROR",
        })
    }
}


