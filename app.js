const express = require("express")
const app = express()
const {allowInsecurePrototypeAccess} = require("@handlebars/allow-prototype-access");
const Handlebars = require("handlebars")
const handlebars = require("express-handlebars").engine
const bodyParser = require("body-parser")
const Agendamentos = require("./models/post")

app.engine("handlebars", handlebars({defaultLayout: "main", handlebars: allowInsecurePrototypeAccess(Handlebars)}))
app.set("view engine", "handlebars")

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.get("/", function(req, res){
    res.render("index")
})

//CREATE
app.post("/cadastrar", function(req, res){
    Agendamentos.create({
        nome: req.body.nome,
        telefone: req.body.telefone,
        origem: req.body.origem,
        data_contato: req.body.data_contato,
        observacao: req.body.observacao
    }).then(function(){
        res.redirect("/consultar");
    }).catch(function(erro){
        res.redirect("/cadastrar");
    })
})

//READ
app.get("/consultar", function (req, res) {
    Agendamentos.findAll() 
      .then((posts) => {
        res.render("consultar", { posts: posts }); 
    }).catch((error) => {
        console.error("Erro ao buscar posts: ", error);
        res.status(500).send("Erro ao buscar posts");
    });
});

//UPDATE
app.post("/atualizar/:id", async function(req, res) {
    const postId = req.params.id;
    const newData = {
        nome: req.body.nome,
        telefone: req.body.telefone,
        origem: req.body.origem,
        data_contato: req.body.data_contato,
        observacao: req.body.observacao
    };

    await Agendamentos.update(newData, { where: { id: postId } })
        .then(function() {
            res.redirect("/consultar");
        })
        .catch(function(erro) {
            console.error("Erro ao atualizar os dados:", erro);
            res.render("atualizar", { postId: postId });
        });
});

app.get("/atualizar/:id", async function(req, res){
    const post = await Agendamentos.findByPk(req.params.id)

    if(post){
        res.render("atualizar", { postId: post });
    }else{
        res.redirect("/consultar");
    }
})

//DELETE
app.post("/excluir/:id", function(req, res) {
    const postId = req.params.id;

    Agendamentos.destroy({ where: { id: postId } })
        .then(function() {
            res.redirect("/consultar");
        })
        .catch(function(erro) {
            console.error("Erro ao excluir os dados:", erro);
            res.render("consultar", { error: "Erro ao excluir os dados" });
        });
});


app.listen(8081, function(){
    console.log("Servidor ativo na porta 8081!")
})