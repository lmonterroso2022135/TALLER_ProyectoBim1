import User from '../users/user.model.js'
import Category from '../categories/category.model.js';
// import Book from '../books/book.model.js';

export const emailExists = async (email = '') => {
    const emailE = await User.findOne({email});
    if (emailE){
        throw new Error(`The email ${email} is alredy register`);
    }
}

export const categoryExists = async (categoryName = '') => {
    const cateE = await Category.findOne({categoryName});
    if(cateE){
        throw new Error(`The category ${categoryName} is alredy register`);
    }
}

// export const bookExists = async (bookName = '') => {
//     const bookE = await Book.findOne({bookName});
//     if(bookE){
//         throw new Error(`The book ${bookName} is alredy register`);
//     }
// }