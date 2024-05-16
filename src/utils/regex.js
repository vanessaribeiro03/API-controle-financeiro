const regexPassword = '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$';
const fullName = '^[a-zA-ZÀ-ÿ]{3,}(?: [a-zA-ZÀ-ÿ]{3,})+$';

module.exports = {
    regexPassword,
    fullName
}