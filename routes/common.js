const express= require('express');
const router=express.Router();
const 
    { getAllStudent , getParticularStudent , getAllBook, getParticularBook, getAllLibrarian, getParticularLibrarian, getBookStoreData, getParticularBookStoreData}
=require('../controller/common')

// HIGH PROTECTED
router.get('/get-all-student',getAllStudent); // done
router.get('/get-particular-student/:studentId',getParticularStudent); // done
router.get('/get-all-book',getAllBook); // done
router.get('/get-particular-book/:bookId',getParticularBook); // done
router.get('/get-all-librarian',getAllLibrarian); // done
router.get('/get-particular-librarian/:librarianId',getParticularLibrarian); // done
router.get('/get-book-store-data',getBookStoreData); // done
router.get('/get-particular-book-store-data/:bookCode',getParticularBookStoreData); // done


module.exports=router;