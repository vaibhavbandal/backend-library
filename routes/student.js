const express= require('express');
const router=express.Router();
const {varifyTokenForStudent} =require('../configuration/token');
const 
{
    login   , changePassword , studentActiveBook,studentIssueReturnHistory ,getStudentData
}=require('../controller/student')


// public
router.post('/login',login);   // done
router.post('/change-password',changePassword);   // done
router.get('/student-active-book',varifyTokenForStudent,studentActiveBook);   // done
router.get('/student-issue-return-history',varifyTokenForStudent,studentIssueReturnHistory);   // done
router.get('/student-data',varifyTokenForStudent,getStudentData);



module.exports=router; 