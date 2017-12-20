const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

var app = express();

// Definizione dei Partials e la loro posizione
hbs.registerPartials(__dirname + '/views/partials');

// Metodo che permette di utilizzare un tamplate engine
app.set('view engine','hbs');

//use permette di utilizzare le middleware di Express
// static è una middleware di Express che permette di gestire i file statici come css , immagini ecc...
// per utilizzarli vengono inseriti in una directori statica (__dirname è la path del progetto)
app.use(express.static(__dirname + '/public'));

// Utilizzo delle middleware di Express
// next viene utilizzata per far continuare a girare l'applicazione. 
// Se non viene richiamata la funzione next la middleware continuerà a girare
app.use((req, res, next)=>{
    var now = new Date().toString();
    var log = `${now}: ${req.method} ${req.url}`;
    console.log(log);    // Posso visualizzare che metodo è stato richiamato dal client e su che url
    // Salvo in un file di log tutte le richieste fatte sul sito
    fs.appendFile('server.log', log + '\n', (err)=>{    
        if (err) {console.log('Unable to append to server.log');}
    });
    next();
});

// Questa middleware intercetta qualsiasi richiesta e la reindirizza alla pagina maintenance
// le middleware si avviano nell'ordine in cui sono scritte nel codice quindi in ogni caso viene
// eseguta express.static che rendirizza alla pagina help e viengono scritte comunque le richieste nel file di log
// app.use((req, res, next)=>{
//     res.render('maintenance.hbs');
// });

// Metodo per inserire valori dinamici nelle pagine come per esempio l'anno corrente
hbs.registerHelper('getCurrentYear', ()=>{
    return new Date().getFullYear();//Restituisce l'anno attuale
});

// In questo caso passando del testo lo rendo maiuscolo
hbs.registerHelper('screamIt', (text)=>{
    return text.toUpperCase(); 
})

app.get('/',(req,res)=>{
    res.render('home.hbs', {
        pageTitle: 'Home Page',
        welcomeMessage: 'Hello, welcome to my website' 
    });
});

// Specifico che nella pagina about renderizzo il file about.hbs e gli passo dei parametri per rendere dinamica la pagina
app.get('/about',(req,res)=>{
    res.render('about.hbs', {
        pageTitle: 'About Page',  
    });
});

app.get('/bad',(req,res)=>{
    res.send({
        errorMessage: 'Unable to handle request',
    });
});

app.listen(3000, () => {
    console.log('Server is up on port 3000');
});