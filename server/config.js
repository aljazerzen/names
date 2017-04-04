const defaultPassword = 'rabbits';

module.exports = {
  title: 'Užali me',
  port: process.env.PORT || 3000,
  mongoPort: process.env.MONGO_PORT || 27017,
  mongoUrl: process.env.MONGO_URL || 'localhost',
  mongoDbName: process.env.MONGO_DB_NAME || 'names',
  password: process.env.PASSWORD || defaultPassword,
  defaultPassword: defaultPassword,

  themes: {
    colors: [
      { font: '#222222', background: '#fff' },
      { font: '#ffffff', background: '#000' },
      { font: '#F50057', background: '#000' },
      { font: '#D500F9', background: '#000' },
      { font: '#651FFF', background: '#000' },
      { font: '#C6FF00', background: '#000' },
    ],
    fonts: [
      "'Roboto', sans-serif",
      "'PT Sans', sans-serif",
      "'Raleway', sans-serif",
      "'Droid Sans', sans-serif",
      "'Playfair Display', serif",
      "'Lobster', cursive"
    ]
  },

  statics: [
    'src/',
    'node_modules/'
  ]
};
