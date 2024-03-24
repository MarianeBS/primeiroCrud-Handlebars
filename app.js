const express = require("express")
const app = express()
const handlebars = require("express-handlebars").engine
const bodyParser = require("body-parser")
const post = require("./models/post")

app.engine("handlebars", handlebars({defaultLayout: "main"}))
app.set("view engine", "handlebars")

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.get("/", function(req, res){
    res.render("index")
})

//CREATE
app.post("/cadastrar", function(req, res){
    post.create({
        nome: req.body.nome,
        telefone: req.body.telefone,
        origem: req.body.origem,
        data_contato: req.body.data_contato,
        observacao: req.body.observacao
    }).then(function(){
        res.send("Dados enviados com sucesso!")
    }).catch(function(erro){
        res.send("Falha ao cadastrar os dados" + erro)
    })
})

//READ
app.get("/consultar", function (req, res) {
    post.findAll() 
      .then((posts) => {
        res.render("consultar", { posts: posts }); 
    }).catch((error) => {
        console.error("Erro ao buscar posts: ", error);
        res.status(500).send("Erro ao buscar posts");
    });
});

//UPDATE
app.get("/atualizar/:id", function(req, res) {
    const postId = req.params.id;
    const newData = {
        nome: req.body.nome,
        telefone: req.body.telefone,
        origem: req.body.origem,
        data_contato: req.body.data_contato,
        observacao: req.body.observacao
    };

    post.update(newData, { where: { id: postId } })
        .then(function() {
            res.redirect("/consultar");
        })
        .catch(function(erro) {
            console.error("Erro ao atualizar os dados:", erro);
            res.render("atualizar", { postId: postId });
        });
});


app.listen(8081, function(){
    console.log("Servidor ativo!")
})