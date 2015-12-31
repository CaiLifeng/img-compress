/**
 * Created by clf on 2015/12/29.
 */

(function(window){

//polyfill
if (!HTMLCanvasElement.prototype.toBlob) {
    Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
        value: function (callback, type, quality) {

            var binStr = atob( this.toDataURL(type, quality).split(',')[1] ),
                len = binStr.length,
                arr = new Uint8Array(len);

            for (var i=0; i<len; i++ ) {
                arr[i] = binStr.charCodeAt(i);
            }

            callback(new Blob( [arr], {type: type || 'image/png'} ) );
        }
    });
}
function imgCompressToBlob(source_img_obj,quality,callback){
    var cvs=document.createElement('canvas');
    cvs.width = source_img_obj.naturalWidth;
    cvs.height = source_img_obj.naturalHeight;
    var ctx=cvs.getContext('2d').drawImage(source_img_obj,0,0);
    cvs.toBlob(function(blob){
        callback(blob);
    },'image/jpeg',quality);
}


function imgCompressToImg(source_img_obj,quality){
    var cvs = document.createElement('canvas');
    cvs.width = source_img_obj.naturalWidth;
    cvs.height = source_img_obj.naturalHeight;
    var ctx = cvs.getContext("2d").drawImage(source_img_obj, 0, 0);
    var newImageData = cvs.toDataURL('image/jpeg', quality);
    var result_image_obj = new Image();
    result_image_obj.src = newImageData;
    return result_image_obj;
}



function fileCompressToImg(source_file_obj,max_size,callback){
    var quality=1;
    if(source_file_obj.size>max_size){
        quality=(max_size/source_file_obj.size).toFixed(1);
    }

    var reader=new FileReader();
    reader.onload=function(e){
        var imgObj=new Image();
        imgObj.src= e.target.result;
        imgObj.onload=function(){
            var cvs=document.createElement('canvas');
            cvs.width = imgObj.naturalWidth;
            cvs.height = imgObj.naturalHeight;
            var ctx=cvs.getContext('2d').drawImage(imgObj,0,0);
            console.log('image quality is'+quality);
            var newImageData = cvs.toDataURL('image/jpeg', quality);
            var result_image_obj = new Image();
            result_image_obj.src = newImageData;
            callback(result_image_obj);
        }
    };
    reader.readAsDataURL(source_file_obj);
}

function fileCompressToBlob(source_file_obj,max_size,callback){
    var quality=1;
    if(source_file_obj.size>max_size){
        quality=(max_size/source_file_obj.size).toFixed(1);
    }

    var reader=new FileReader();
    reader.onload=function(e){
        var imgObj=new Image();
        imgObj.src=e.target.result;
        imgObj.onload=function(){
            var cvs=document.createElement('canvas');
            cvs.width = imgObj.naturalWidth;
            cvs.height = imgObj.naturalHeight;
            console.log('blob quality is'+quality);
            var ctx=cvs.getContext('2d').drawImage(imgObj,0,0);
            cvs.toBlob(function(blob){
                callback(blob);
            },'image/jpeg',quality);
        };
    };
    reader.readAsDataURL(source_file_obj);
};


window.imgComp={
    imgCompressToBlob:imgCompressToBlob,
    imgCompressToImg:imgCompressToImg,
    fileCompressToImg:fileCompressToImg,
    fileCompressToBlob:fileCompressToBlob
};
})(window);