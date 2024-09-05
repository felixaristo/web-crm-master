export const handleFile=(evt,key)=>{
    const file = evt.target.files[0];
        const fileTypesImage = ['pdf','doc','docx','ppt','pptx','xls','xlsx','png','jpg','jpeg'];
        // console.log('hhoohe',file)

        if (evt.target.files && file&&file!==undefined) {

            const extension = evt.target.files[0].name.split('.').pop().toLowerCase();
            const isSuccess = fileTypesImage.indexOf(extension) > -1;
            if (isSuccess&&file!==undefined) {
                let data={
                    file:file,
                    file_name:file.name,
                    file_error:null
                }
                return data
            }
            else {
                let data={
                    file:null,
                    file_name:null,
                    file_error:'File type not allowed. File type to be must *.ppt *.pptx *.pdf *.doc *.docx'
                }
                // alert('eh')

                return data
            }

        }else{
            let data={
                file:null,
                file_name:null,
                file_error:'Please select file'
            }

            return data

        }
}
export const getBase64=(file, cb)=> {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
        cb(reader.result)
    };
    reader.onerror = function (error) {
        console.log('Error: ', error);
    };
}

export const decodeBase64=async(url,file_name,cb)=>{
        
    let file=fetch(url)
        .then(res => res.blob())
        .then(blob => {
            const file = new File([blob], file_name,{ type: "image/png" })
            
            return file
        })
    return file
}