'use strict';
var models = require('./../models/');
var uuid = require('uuid');
var Historia = models.historia_clinica;
var Persona = models.persona;
var Cita = models.cita;
var Secuencia = models.secuencia_tratamiento;
class CitasController {
    listarPacientes(req, res) {
        Historia.findAll({include: {model: Persona}}).then(function (paciente) {
            if (paciente) {
                res.render('Pacientes', {title: 'Pacientes', Paciente: paciente, ocultar: 'true'});

            }
        }).catch(function (err) {
            req.flash('error', 'Hubo un error');
            res.redirect('/lista/pacientes/');
        });
    }
    listarCitas(req, res) {
        Cita.findAll({include: {model: Persona}}).then(function (cita) {
            if (cita) {

                res.render('citas', {title: 'Citas', Citas: cita, ocultar: 'true'});
            }
        }).catch(function (err) {
            req.flash('error', 'Hubo un error');
            res.redirect('/lista/pacientes/');
        });
    }
    guardarCitas(req, res) {
        Cita.create({
            detalle_costo: "0",
            costo: "0",
            fecha: req.body.fecha,
            hora: req.body.hora,
            estado: false,
            externa_id: uuid.v4(),
            personaId: req.body.paciente_id

        }).then(function (newCita, created) {
            if (newCita) {
                Secuencia.create({
                    fecha: req.body.fecha,
                    diagnostico: "0",
                    tratamiento_realizado: "0",
                    external_id: uuid.v4(),
                    citumId: newCita.id

                }).then(function (newSecuencia, created) {
                    if (newSecuencia) {
                        req.flash('info', 'exito');
                        res.redirect('/citas');

                    }
                }).catch(function (err) {
                    req.flash('error', 'Hubo un error');
                    res.redirect('/lista/pacientes/');
                });

            }
        }).catch(function (err) {
            req.flash('error', 'Hubo un error');
            res.redirect('/lista/pacientes/');
        });
    }
    pagoCitas(req,res){
        Cita.update({
                    estado:req.body.estado
                },{where:{externa_id:req.body.external}}).then(function (updateSecuencia, created) {
                    if (updateSecuencia) {
                        req.flash('info', 'Pago exitoso');
                        res.redirect('/citas');
                    }
                }).catch(function (err) {
                    req.flash('error', 'Hubo un error');
                    res.redirect('/citas');
                });
    }
    editarCitas(req,res){
        Cita.update({
                    fecha:req.body.fecha,
                    hora:req.body.hora
                },{where:{externa_id:req.body.external1}}).then(function (updateSecuencia, created) {
                    if (updateSecuencia) {
                        req.flash('info', 'Pago exitoso');
                        res.redirect('/citas');
                    }
                }).catch(function (err) {
                    req.flash('error', 'Hubo un error');
                    res.redirect('/citas');
                });
    }


}
module.exports = CitasController;