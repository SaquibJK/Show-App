module.exports = {
  date: () => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    let date = new Date().toLocaleString("en-IN", options);

    return date;
  },

  time: () => {
    const options = {
      hour: "numeric",
      minute: "numeric",
    };

    let time = new Date().toLocaleString("en-IN", options);

    return time;
  },
};
