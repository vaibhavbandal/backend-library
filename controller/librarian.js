const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Admin = require('../models/Admin');
const Librarian = require('../models/Librarian');
const Student = require('../models/Student');
const Book = require('../models/Book');
const BookStore = require('../models/BookStore');
const BookIR = require('../models/BookIR');
const { getToken } = require('../configuration/token');

exports.librarianLogin = async (req, res) => {
    try {


        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(200).json({
                login: false,
                code: "MISSING_BODY_DATA",
            })
        }


        const isLibrarian = await Librarian.findOne({ email: email });
        if (!isLibrarian) {
            return res.status(200).json({
                login: false,
                code: "EMAIL IS NOT REGISTERED",
            })
        }
        // console.info('32')
        
        const isPasswordOk = await bcrypt.compare(password, isLibrarian.password);
        if (isPasswordOk) {
            // generating token
            const token = getToken(isLibrarian);
            console.info(token)
            return res.status(200).header({
                "Authorization": token
            }).json({
                login: true,
                code: "LOGIN_SUCCESSFULLY",
            })
        } else {
            console.info('47')
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
// email,password <-- body

exports.changePassword = async (req, res) => {
    try {

        const { email, password, newPassword } = req.body;

        if (!email || !password || !newPassword) {
            return res.status(200).json({
                status: false,
                code: "BODY_DATA_MISSING",
            })
        }

        const isLibrarian = await Librarian.findOne({ email: email });
        if (!isLibrarian) {
            return res.status(200).json({
                status: false,
                code: "UNREGISTERED EMAIL",
            })
        }

        if (! await bcrypt.compare(password, isLibrarian.password)) {
            return res.status(200).json({
                status: false,
                code: "OLD PASSWORD IS WRONG",
            })
        }

        const hashedPassword = await bcrypt.hash(newPassword, bcrypt.genSaltSync(10));

        const changedPassword = await Librarian.updateOne({ email: email }, {
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
        return res.status(400).json({
            status: false,
            code: "API_CALLING_ERROR",
        })
    }
}
// email,password,newPassword <-- body

exports.registerStudent = async (req, res) => {
    try {
        const { firstName, lastName, email, mobile, password } = req.body;
        if (!firstName || !lastName || !email || !mobile || !password) {
            return res.status(200).json({
                status: false,
                code: "MISSING_BODY_DATA",
            })
        }

        const isEmialExists = await Student.findOne({email:email});
        if(isEmialExists){
            return res.status(200).json({
                status:false,
                code: "DUPLICATE_EMAIL",
            })
        }

        const hashedPassword = await bcrypt.hash(password, bcrypt.genSaltSync(10));
        try {

            const newStudent = new Student({
                firstName, lastName, email, password: hashedPassword, mobile,
                type: "STUDENT", book: null, bookStatus: false
            })
            await newStudent.save();

        } catch (error) {
            return res.status(200).json({
                status:false,
                code: "DUPLICATE_EMAIL",
            })
        }
        return res.status(200).json({
            status:true,
            code: "REGISTERED",
        })
    } catch (error) {
        return res.status(400).json({
            status: "ERROR",
            code: "API_CALLING_ERROR",
        })
    }
}


exports.bookIssueReturn = async (req, res) => { 

    const {email,type,bookCode} = req.body;

    const student=await Student.findOne({email:email});
    if(!student){
        return res.status(200).json({
            status:false,
            code: "INVALID_STUDENT_EMAIL",
        })
    }

    const book=await Book.findOne({bookCode:bookCode});
    if(!book){
        return res.status(200).json({
            code: "INVALID_BOOKCODE",
            status:false
        })
    }

    const librarian= await Librarian.findById({_id:req.user.ID});

// ------------------------------------------------------------
    if(type==='ISSUE'){

        if(!(student.bookStatus===false)){
            return res.status(200).json({
                code: "STUDENT_HAS_ALREADY_BOOK",
                status:false
            })
        }

        // Checking quantity of given book
        const bookStore=await BookStore.findOne({bookCode:bookCode});
        if((bookStore.totalQuantity===bookStore.issueQuantity)){
            return res.status(200).json({
                status:false,
                code: "BOOK_NOT_AVAILABLE",
            })
        }

        // update in student record
        await Student.findOneAndUpdate({email:email},{
            bookCode:bookCode,
            bookStatus:true
        }) 

        

        const newBookIR=new BookIR({
            book:book._id,
            studentEmail:student.email,
            librarianEmail:librarian.email,
            bookCode:bookCode,
            student:student._id,
            librarian:req.user.ID,
            type:"ISSUE"
        })

        await newBookIR.save();

        // Updating Book Store
        await BookStore.findOneAndUpdate({bookCode:bookCode},{
            issueQuantity:bookStore.issueQuantity+1
        })

        return res.status(200).json({
            status:true,
            code: "ISSUE_SUCCESSFULLY",
        })

    }else if(type==='RETURN') {

        if(!(student.bookStatus===true)){
            return res.status(200).json({
                status:false,
                code: "STUDENT_HAS_NOT_BOOK",
            })
        }


        if(!(student.bookCode===bookCode)){
            return res.status(200).json({
                status:false,
                code: "STUDENT_WITH_WRONG_BOOKCODE",
            })
        }



        const bookStore=await BookStore.findOne({bookCode:bookCode});
        // update in student record
        await Student.findOneAndUpdate({email:email},{
            bookCode:null,
            bookStatus:false
        })


        const newBookIR=new BookIR({
            book:book._id,
            studentEmail:student.email,
            librarianEmail:librarian.email,
            bookCode:bookCode,student:student._id,
            librarian:req.user.ID,type:"RETURN"
        })

        await newBookIR.save();

        // Updating Book Store
        await BookStore.findOneAndUpdate({bookCode:bookCode},{
            issueQuantity:bookStore.issueQuantity-1
        })

        return res.status(200).json({
            status:true,
            code: "RETURN_SUCCESSFULLY",
        })



 
    }else{
        return res.status(200).json({
            status:false,
            code: "INVALID_TYPE",
        })
    }


}

exports.getLibrarianData=async(req,res)=>{
    try {
        let librarian= await Librarian.findById({_id:req.user.ID});

        let data={...librarian}

        data={...data._doc,password:null}
        
        console.log(data);

        return res.status(200).json(data);

    } catch (error) {
        return res.status(400).json({
            status: "ERROR",
            code: "API_CALLING_ERROR",
        })
    }
    

}
