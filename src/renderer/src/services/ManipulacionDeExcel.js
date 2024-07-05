import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween'

let satinezeJSON = (jsonData) => {
    //console.log('json', jsonData)
    var cleanData = jsonData.map(function (rows) {
        //console.log('rows', rows)
        return {
            'cedula': rows['CEDULA'],
            'fecha': new Date(rows['DATOS DE HORA']),
            'codigo_identificacion': rows['DESCONOCIDO'],
            'id_dispositivo': rows['ID DEL DISPOSITIVO'],
            'nombre': rows['NOMBRE'],
            'operacion': rows['STATUS DEL REGISTRO 1'],
            'descripcion_exepcion': rows['STATUS DEL REGISTRO 2'],
           'departamento': rows['UTILIZABLE'],
            'identificacion': rows['UTILIZABLE_1'],
            'tipo_registro': rows['__EMPTY'],
            //'turno': rows['__EMPTY_1'],
            'codigo_tarea': rows['__EMPTY_2'],
            'numero_dispositivo': rows['__EMPTY_3'],
            'marcado': rows['__EMPTY_4'],
        }
    });
    
    return cleanData; 
}

let filterBetweenDates = (jsonData, since, until) =>{
    dayjs.extend(isBetween);
    const result = jsonData.filter(function (bioRegister) {
        return dayjs(bioRegister.fecha).isBetween(dayjs(since), dayjs(until));

    });
    return result; 
}

let groupBioRegisterByDate = (jsonData) => {
    const result = Object.groupBy(jsonData, ({ fecha }) => dayjs(fecha).format('DD-MM-YYYY'));
    return result
}

let groupBioRegisterByCedula = (jsonData) => {
    let result = {}
    for (let fecha in jsonData){
        result[fecha] = Object.groupBy(jsonData[fecha], ({ cedula }) => cedula);
    }
    return result;
}

let calculoDeHora = (jsonData) => {
    let result = {}
    for (let fecha in jsonData){
        for (let cedula in jsonData[fecha]){
            let registrosPorCedulas = jsonData[fecha][cedula]
            registrosPorCedulas.sort(function (a, b) {
                if (dayjs(a.fecha).isBefore(dayjs(b.fecha))) {
                    return -1;
                }
                return 1;
            });

            let primerRegistro = registrosPorCedulas[0]
            let ultimoRegistro = registrosPorCedulas[registrosPorCedulas.length - 1]
              
            let diff = dayjs(primerRegistro.fecha).diff(dayjs(ultimoRegistro.fecha), 'hour', true)
            if (result[fecha] == undefined) {
                result[fecha] = {}
            }

            result[fecha][cedula] = {
                'departamento': primerRegistro.departamento,
                'cedula': primerRegistro.cedula,
                'nombre': primerRegistro.nombre,
                'horas': diff * -1,
            }
        }

    }
    console.log(result);
    return result;
}

let procesarDatosBiometricos = (jsonData, since, until) => {
    var filteredBetweenDates = filterBetweenDates(jsonData, since, until)
    var groupedBioRegisterByDate = groupBioRegisterByDate(filteredBetweenDates)
    var groupedBioRegisterByCedula = groupBioRegisterByCedula(groupedBioRegisterByDate)
    var horaCalculada = calculoDeHora(groupedBioRegisterByCedula)
    return horaCalculada;
}



export {
    satinezeJSON,
    procesarDatosBiometricos,
};