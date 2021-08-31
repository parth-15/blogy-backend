const dummy = (blogs) => 1;

const totalLikes = (blogs) => blogs.reduce((sum, blog) => blog.likes + sum, 0);

const favoriteBlog = (blogs) => {
  let mostLikedBlog = {};
  blogs.forEach((blog) => {
    if (!mostLikedBlog.likes || mostLikedBlog.likes < blog.likes) {
      mostLikedBlog = blog;
    }
  });
  return mostLikedBlog;
};

module.exports = { dummy, totalLikes, favoriteBlog };
