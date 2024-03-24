const Sequelize = require("sequelize")
const sequelize = new Sequelize("mariane", "root", "", {
    host: "localhost",
    dialect: "mysql"
})

module.exports = {
    Sequelize: Sequelize,
    sequelize: sequelize
}

