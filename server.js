// configurando o servidor
const express = require("express")
const servidor =  express()

// configurar o servidor para apresentar arquivos extras
servidor.use(express.static('public')) // pasta onde ficará os arquivos estáticos

// habilitar body do formulario no express
servidor.use(express.urlencoded({extended:true}))

// configurando a configuracao com o Banco Postgree
const Pool = require('pg').Pool
const db =  new Pool({
    user: 'postgres',
    password: 'Br@sil20',
    host: 'localhost',
    port: 5432,
    database: 'doe'

})

// configurando a template engine
const nunjucks = require("nunjucks")
nunjucks.configure("./", {
    express:servidor,
    noCache: true
})



// configurar o acesso a página
servidor.get("/", function(req, res){
    
    db.query("SELECT * FROM donors", function(err, result){
        if(err) return res.send("Erro ao consultar o Banco de Dados!")

        const donors = result.rows
        return res.render("index.html", {donors})
    })
})

// pegar os dados do formulário para realizar o imput das informacoes dos doadores
servidor.post("/", function(req,res){
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood

    /*// adicionar os input ao array de doadores
    donors.push({
        name: name, 
        blood: blood,

    })*/

    if(name == "" || email == "" || blood == ""){
        return res.send("Preencha todos os campos!")
    }
    
    const query = `INSERT INTO donors ("name", "email", "blood")
    VALUES ($1, $2, $3)`
    
    const values =  [name, email, blood]
    db.query(query, values, function(err){
      if(err) return res.send('erro no banco de dados')
  
      return res.redirect('/')
    })
})

// ligar o servidor e permitir o acesso na porta 3000

servidor.listen(3000, function(){
    console.log("iniciei o servidor!")
})