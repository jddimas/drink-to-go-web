import swal from "sweetalert";

export default {
  methods: {
    confirmationWarning(title, text, confirmText, closeOnConfirm) {
      return swal({
        title: title,
        text: text,
        icon: "warning",
        buttons: {
          cancel: {
            text: "Cancelar",
            value: false,
            closeModal: true,
            visible: true,
            className: "swalCancelBtn"
          },
          confirm: {
            text: confirmText,
            value: true,
            closeModal: closeOnConfirm,
            visible: true,
            className: "swalConfirmBtn"
          }
        },
        closeOnEsc: true
      });
    },
    successNotif(title, text){
      swal({
        title: title,
        text: text,
        icon: "success",
      });
    },
    errorNotif(title, text){
      swal({
        title: title,
        text: text,
        icon: "error",
      });
    }
  }
}