const express= require('express');
const { varifyToken } = require('../configuration/token');
const router=express.Router();
const 
{adminSignup, adminLogin, changePassword , importBooks, checkingBookCode, registerNewLibrarian,getAdminData}
 

=require('../controller/admin')
 
// HIGH PROTECTED
router.post('/signup',adminSignup); // done
// public
router.post('/login',adminLogin);   // done
// protected
router.get('/admin-data',varifyToken,getAdminData);

router.post('/change-password',changePassword);   // done
// protected
router.post('/check-book-code',checkingBookCode);   // done
router.post('/import-book',importBooks);   // done
router.post('/register-librarian',registerNewLibrarian);   // done
  

module.exports=router;