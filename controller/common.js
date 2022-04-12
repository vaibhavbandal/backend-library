const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Admin = require('../models/Admin');
const Student = require("../models/Student");
const Book = require("../models/Book");
const Librarian = require("../models/Librarian");
const BookStore = require("../models/BookStore");




exports.getAllStudent=async (req,res)=>{
    
    try {
        const student=await Student.find({});
        return res.status(200).json({
            status:true,
            student
        })
        
    } catch (error) {
        return res.status(200).json({
            status:false,
            code:"ERROR"
        })
    }
    
}

exports.getParticularStudent=async (req,res)=>{

    try {
        const student=await Student.findById({_id:req.params.studentId}) 
        return res.status(200).json({
            status:true,
            student
        })
        
    } catch (error) {
        return res.status(200).json({
            code:"ERROR",
            status:false
        })
    }
    
}


exports.getAllBook=async (req,res)=>{
    
    try {
        const book=await Book.find({});
        return res.status(200).json({
            status:true,
            book
        })
        
    } catch (error) {
        return res.status(200).json({
            code:"ERROR",
            status:false
        })
    }
    
}


exports.getParticularBook=async (req,res)=>{

    try {
        const book=await Book.findById({_id:req.params.bookId}) 
        return res.status(200).json({
            status:true,
            book
        })
        
    } catch (error) {
        return res.status(200).json({
            code:"ERROR",
            status:false
        })
    }
    
}

exports.getAllLibrarian=async (req,res)=>{
    
    try {
        const librarian=await Librarian.find({});
        return res.status(200).json({
            status:true,
            librarian
        })
        
    } catch (error) {
        return res.status(400).json({
            code:"ERROR",
            status:false
        })
    }
    
}


exports.getParticularLibrarian=async (req,res)=>{

    try {
        const librarian=await Librarian.findById({_id:req.params.librarianId}) 
        return res.status(200).json({
            status:true ,
            librarian
        })
        
    } catch (error) {
        return res.status(200).json({
            code:"ERROR",
            status:false
        })
    }
    
}

exports.getBookStoreData=async (req,res)=>{
    
    try {
        const bookStore=await BookStore.find({});
        return res.status(200).json({
            status:true,
            bookStore
        })
        
    } catch (error) {
        return res.status(200).json({
            code:"ERROR",
            status:false 
        })
    }
    
}

exports.getParticularBookStoreData=async (req,res)=>{
    
    try {
        const bookStore=await BookStore.find({bookCode:req.params.bookCode});
        return res.status(200).json({
            status:true,
            bookStore
        })
        
    } catch (error) {
        return res.status(200).json({
            code:"ERROR",
            status:false 
        })
    }
    
}