const express= require('express');
const router=express.Router();
const {varifyToken} =require('../configuration/token');
const 
{
    librarianLogin,changePassword,registerStudent,bookIssueReturn,getLibrarianData
}=require('../controller/librarian')


// public
router.post('/login',librarianLogin);   // done
router.post('/change-password',changePassword);   // done
router.post('/student-register',registerStudent);   // done
router.post('/issue-return-book',varifyToken,bookIssueReturn);   // done
router.get('/librarian-data',varifyToken,getLibrarianData);


module.exports=router; 