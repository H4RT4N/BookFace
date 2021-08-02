import React, { useEffect, useState } from "react";
import { Grid } from "@material-ui/core";
import { DeleteSweep } from "@material-ui/icons";

import PostContainer from "./PostContainer";
import PostForm from "./PostForm";

// butter toast
import ButterToast, { Cinnamon } from "butter-toast";
//redux
import { connect } from "react-redux";
import { fetchAllPosts, deletePost, likePost } from "../../actions/postActions";

function Feed(props) {
  // current user if there are any
  const user = JSON.parse(localStorage.getItem('profile'));

  // componentDidMount
  useEffect(() => {
    props.fetchAllPosts();
  }, []);

  // selecting a specific post
  const [postID, setPostID] = useState(0);
  // edit a post
  const handleEdit = (id) => {
      setPostID(id);
  };
  const handleLike = (id) => {
    props.likePost(id);
  }
  // delete a post
  const handleDelete = (id) => {
    const onSuccess = () => {
      ButterToast.raise({
        content: (
          <Cinnamon.Crisp
            title="Deleted!"
            scheme={Cinnamon.Crisp.SCHEME_GREEN}
            icon={<DeleteSweep />}
          />
        ),
      });
    };
    //if (window.confirm("Are you sure?")) 
    props.deletePost(id, onSuccess);
  };

  return (
    <Grid 
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
    >
      <PostForm {...{ postID, setPostID }} />
      <Grid
        container
        spacing={0}
        direction="column-reverse"
        alignItems="center"
        justifyContent="center"
      >
        {props.posts.map((post) => (
          <PostContainer 
            post={post} 
            key={post._id} 
            onEdit={handleEdit}
            onDelete={handleDelete} 
            onLike={handleLike}
            user={user}
        />
        ))}
      </Grid>
    </Grid>
  );
}

const mapStateToProps = (state) => ({
  posts: state.postReducer.posts,
});

export default connect(mapStateToProps, { fetchAllPosts, deletePost, likePost })(Feed);
