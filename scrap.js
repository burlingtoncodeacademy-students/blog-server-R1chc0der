// TODO Delete One
// http://localhost:4000/movies/643c7dd92846c6ae32e80467
// ! Adding Validate session
router.delete("/:id", validateSession, async (req, res) => {
  try {
    //1. Capture ID
    const { id } = req.params;

    //2. Use delete method to locate and remove based off ID
    const deleteMovie = await Movie.deleteOne({
      _id: id,
      owner_id: req.user._id,
    });

    //3. Respond to Client, with a ternary for a ? if true do this : false do this
    deleteMovie.deletedCount
      ? res.status(200).json({
          message: "Movie deleted from database.",
        })
      : res.status(404).json({
          message: "No movie in the collection was found.",
        });
  } catch (err) {
    errorResponse(res, err);
  }
});
