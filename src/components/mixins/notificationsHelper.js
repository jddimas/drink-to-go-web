export default {
  methods:{
    successNotif(title, text, time=null){
      this.$vs.notify({
        title: title,
        text: text,
        color:'success',
        iconPack: 'feather',
        position: 'top-center',
        time: time || '5000',
        icon:'icon-check'
      });
    },
    warningNotif(title, text, time=null){
      this.$vs.notify({
        title: title,
        text: text,
        color:'warning',
        iconPack: 'feather',
        position: 'top-center',
        time: time || '5000',
        icon:'icon-alert-circle'
      });
    },
    darkNotif(title, text, time=null){
      this.$vs.notify({
        title: title,
        text: text,
        color:'dark',
        iconPack: 'feather',
        position: 'top-center',
        time: time || '5000',
        icon:'icon-alert-circle'
      });
    },
    errorNotif(title, text, time=null){
      this.$vs.notify({
        title: title,
        text: text,
        color:'danger',
        iconPack: 'feather',
        position: 'top-center',
        time: time || '5000',
        icon:'icon-alert-circle'
      });
    },
    fixedErrorNotif(title, text){
      text += " Clic para cerrar";
      this.$vs.notify({
        title: title,
        text: text,
        color:'danger',
        iconPack: 'feather',
        position: 'top-center',
        icon:'icon-alert-circle',
        fixed: true,
      });
    },
    saveSuccessNotif(title=null, text=null, time=null){
      this.successNotif(title || "Operación exitosa", text || "Información actualizada correctamente.", time);
    },
    addSuccessNotif(title=null, text=null, time=null){
      this.successNotif(title || "Operación exitosa", text || "Registro agregado correctamente.", time);
    },
    deleteSuccessNotif(title=null, text=null, time=null){
      this.successNotif(title || "Operación exitosa", text || "Registro eliminado exitosamente.", time);
    },
    missingFieldsNotif(title=null, text=null, time=null){
      this.warningNotif(title || 'Información faltante o incorrecta', text || "Por favor complete todos los campos indicados.", time);
    },
    failedOperationNotif(title=null, text=null, time=null){
      this.errorNotif(title || 'Error en guardado', text || "Ha ocurrido un error con la operación, intente más tarde.", time);
    },
    notFieldsToUpdate(title=null, text=null, time=null){
      this.warningNotif(title || 'Sin cambios', text || "No hay cambios por guardar.", 4000);
    },
    errorNotifDialog(title, text){
      this.$vs.dialog({
        type: 'alert',
        color: 'danger',
        title: title,
        text: text,
        acceptText: "Aceptar",
      });
    },
    successNotifDialog(title, text){
      this.$vs.dialog({
        type: 'alert',
        color: 'success',
        title: title,
        text: text,
        acceptText: "Aceptar",
      });
    },
    warningNotifDialog(title, text){
      this.$vs.dialog({
        type: 'alert',
        color: 'orange',
        title: title,
        text: text,
        acceptText: "Aceptar",
      });
    },
    confirmationDialog(callback, title, text, acceptText = 'Aceptar', cancelText = 'Cancelar'){
      this.$vs.dialog({
        type: 'confirm',
        color: 'orange',
        title: title,
        text: text,
        acceptText: acceptText,
        cancelText: cancelText,
        accept: callback
      });
    },
    successDialogWithCallbacks(acceptCallback, cancelCallback, title, text, acceptText = 'Aceptar', cancelText = 'Cancelar'){
      this.$vs.dialog({
        type: 'confirm',
        color: 'success',
        title: title,
        text: text,
        acceptText: acceptText,
        cancelText: cancelText,
        accept: acceptCallback,
        cancel: cancelCallback,
      });
    },
    successDialogWithAcceptCallback(acceptCallback, title, text, acceptText = 'Aceptar'){
      this.$vs.dialog({
        color: 'success',
        title: title,
        text: text,
        acceptText: acceptText,
        accept: acceptCallback,
      });
    },
  }
}