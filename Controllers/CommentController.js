import {
    createOne,
    deleteOne,
    getAll,
    getOne,
    updateOne,
  } from "./HandleFactory.js";
import CommentModel from "../Models/commentModel.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";



export const createComment = createOne(CommentModel);
export const getComment = getOne(CommentModel);
export const deleteComment = deleteOne(CommentModel);
export const getAllComment = getAll(CommentModel);
export const updateComment = updateOne(CommentModel);
export const getAllCommentOfAPost = getAll(CommentModel)
