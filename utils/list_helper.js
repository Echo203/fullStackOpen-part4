const totalLikes = (listOfBlogPosts) => {
  if (listOfBlogPosts.length === 0) {
    return 0;
  } else {
    const sumOfLIkes = listOfBlogPosts.reduce((sum, post) => {
      return sum + post.likes;
    }, 0);
    return sumOfLIkes;
  }
};

const favoriteBlog = (listOfBlogPosts) => {
  let mostLikedPost = listOfBlogPosts[0]
  listOfBlogPosts.forEach((post) => {

		if (post.likes >= mostLikedPost.likes) {
      mostLikedPost = post;
    }
  });
  return {
    title: mostLikedPost.title,
    author: mostLikedPost.author,
    likes: mostLikedPost.likes
  };
};

const dummy = (blogs) => {
  return 1;
};

module.exports = {
  dummy,
	favoriteBlog,
  totalLikes,
};
