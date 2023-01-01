var tbody = document.getElementById("tabm");
const rupiah = (number)=>{
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR"
    }).format(number);
  }

no_tabel = 0;

function showMA(){
  if(document.getElementById("ams").classList.contains("visually-hidden")){
    document.getElementById("ams").classList.remove("visually-hidden");
    document.getElementById("nms99").classList.add("d-none");
    document.getElementById("hapusTbl").classList.remove("d-none");
    document.getElementById("bikin").classList.remove("d-none");
  }
}

function add_tabel(){
  var vb = "";
  no_tabel = no_tabel+1;
  showMA();
  var smc = document.createElement("tr");  
  smc.id = "data_"+no_tabel;
  vb += '<td class="p-1">'+no_tabel+'</td>';
  vb += '<td class="p-1"><input type="text" class="form-control" id="nd_'+no_tabel+'"></td>';
  vb += '<td class="p-1"><input type="number" min="1" class="form-control" id="hd_'+no_tabel+'" oninput="hargacek('+"'"+no_tabel+"'"+')"></td>';
  vb += '<td class="p-1"><input type="number" min="1" class="form-control" id="jd_'+no_tabel+'" disabled oninput="jumlahcek('+"'"+no_tabel+"'"+')"></td>';
  vb += '<td class="p-1"><span class="Mqn467 visually-hidden" id="td_'+no_tabel+'"></span><span id="ta_'+no_tabel+'">Rp 0,00</span></td>';
  smc.innerHTML = vb;
  tbody.appendChild(smc); 
}

// var harga = document.getElementById("hd_"+kodes);
// var jumlah = document.getElementById("jd_"+kodes);
// var total = document.getElementById("td_"+kodes);
// var namabarang = document.getElementById("nd_"+kodes);

function hargacek(kodes){
  var harga = document.getElementById("hd_"+kodes);
  var jumlah = document.getElementById("jd_"+kodes);
  var total = document.getElementById("td_"+kodes);
  var totala = document.getElementById("ta_"+kodes);

  if(harga.value == "" ||harga.value == 0 || parseInt(harga.value) < 100){
    jumlah.disabled = true;
  }else{
    jumlah.disabled = false;
  }

  if(jumlah.disabled == false){
    jumlahcek(kodes);
  }else{
    total.innerHTML = "0";
    totala.innerHTML = rupiah(0);
  }
  cvm();
}

function jumlahcek(kodes){
  var harga = document.getElementById("hd_"+kodes);
  var jumlah = document.getElementById("jd_"+kodes);
  var total = document.getElementById("td_"+kodes);
  var totala = document.getElementById("ta_"+kodes);

  if(harga.value !== "" && jumlah.value !== ""){
    harga = parseInt(harga.value);
    jumlah = parseInt(jumlah.value);
    tlt = jumlah * harga;
    total.innerText = tlt;
    totala.innerText = rupiah(tlt);
  }
  cvm();
}

function cvm(){
  var x = document.getElementsByClassName("Mqn467");
  var i;
  var sx = 0;
  for (i = 0; i < x.length; i++) {
    if(x[i].innerText == ""){sx += 0;}else{
      sx += parseInt(x[i].innerText);
    }
  }
  document.getElementById("keseluruhan").innerText = rupiah(sx);
  document.getElementById("kslrh").innerText = sx;
  cekDiskon();
  cekJumlahuang();
}

var produkjson = "";

function produk(){
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      produkjson = JSON.parse(this.responseText);
      var i;
      var x = "";
      for (i = 0; i < produkjson.length; i++) {
        x += '<div class="col-md-2 card me-2 mb-3"><img src="./img/'+produkjson[i]["img"]+'" alt="" width="100%" height="150px"><hr class="opacity-20 mb-1"><span class="h6 mb-0 fw-bold">'+produkjson[i]["nama_produk"]+'</span><span class="mb-2" style="font-size: 14px;">'+rupiah(produkjson[i]["harga_produk"])+'</span><button class="btn btn-primary mb-3" onclick="produkAdd('+"'"+[i]+"'"+')">Tambahkan</button></div>';
      }
      document.getElementById("produk_tampil").innerHTML = x;
    }
  };
  xmlhttp.open("GET", "data/produk.json", true);
  xmlhttp.send();
}

var identitas_usaha;

function usahaIdenti(){
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      identitas_usaha = JSON.parse(this.responseText)[0];
      document.getElementById("nama_toko").innerText = identitas_usaha["nama_bisnis"];
      document.getElementById("jalan_raya").innerText = identitas_usaha["alamat_bisnis"];
      document.getElementById("icon_usaha").src = identitas_usaha["icon"];
    }
  };
  xmlhttp.open("GET", "data/info.json", true);
  xmlhttp.send();

}

window.onload = () =>{
  produk(); 
  usahaIdenti();
  kode_Input('kodeBlnj');
  dateIput('tanggalBlj');
}

function produkAdd(point){
  var vb = "";
  no_tabel = no_tabel+1;
  showMA();
  var smc = document.createElement("tr");  
  var json = produkjson[point];
  smc.id = "data_"+no_tabel;
  vb += '<td class="p-1">'+no_tabel+'</td>';
  vb += '<td class="p-1"><input type="text" readonly class="form-control" id="nd_'+no_tabel+'" value="'+json["nama_produk"]+'"></td>';
  vb += '<td class="p-1"><input type="number" readonly min="1" class="form-control" id="hd_'+no_tabel+'" value="'+json["harga_produk"]+'" oninput="hargacek('+"'"+no_tabel+"'"+')"></td>';
  vb += '<td class="p-1"><input type="number" min="1" class="form-control" id="jd_'+no_tabel+'" oninput="jumlahcek('+"'"+no_tabel+"'"+')"></td>';
  vb += '<td class="p-1"><span class="Mqn467 visually-hidden" id="td_'+no_tabel+'">'+json["harga_produk"]+'</span><span id="ta_'+no_tabel+'">'+ rupiah(json["harga_produk"])+'</span></td>';
  smc.innerHTML = vb;
  tbody.appendChild(smc);
  cvm();
  document.getElementById("boxProduk").classList.add("d-none");

}

function aksion(ids,clas){
  var x = document.getElementById(ids).classList;
  if(x.contains(clas)){
    x.remove(clas);
  }else{
    x.add(clas);
  }
}

function cekDiskon(){
  var vs,sd;
  var y = document.getElementById("kslrh");
  var x = document.getElementById("diskon_ck");
  var a = document.getElementById("Ha_hide");
  var k = document.getElementById("Ha_show");
  if(x.value != "" && y.innerHTML != ""){
    vs = parseInt(y.innerHTML) * parseInt(x.value) / 100;
    sd = parseInt(y.innerHTML) - vs;
    sd = Math.round(sd);
    if(sd < 100 || sd == 0){
      a.innerHTML = 0;
      k.innerHTML = "Diskon Eror";
      x.classList.add("is-invalid");
    }else{
      a.innerHTML = sd;
      k.innerHTML = rupiah(sd);
      x.classList.remove("is-invalid");
    }
  }else{
    a.innerHTML = y.innerHTML;
    k.innerHTML = rupiah(y.innerHTML);
    if(x.classList.contains("is-invalid")){
      x.classList.remove("is-invalid");
    }
  }
}


function cekJumlahuang(){
  var total;
  var b = document.getElementById("JumByr1");
  var y = document.getElementById("kslrh");
  var a = document.getElementById("Ha_hide");
  if(y.innerHTML != "" &&  a.innerHTML != "" &&  b.value != ""){
    b = parseInt(b.value);
    a = parseInt(a.innerHTML);
    if(b == a || b > a){
       total = a-b;
       total = String(total);
       if(total == "0"){
         total = "Uang Pas";
      }else{
        total = total.split("-");
        total = rupiah(total[1]);
      }
    }else{
      total = "Jumlah bayar masih kurang";
    }
    document.getElementById("kembalianQwm").innerHTML = total;
  }else{
    document.getElementById("kembalianQwm").innerHTML = "Masukan Uang";
  }
}

function random(length = 8,smc) {
  let chars;
  if(smc == 3){
    chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  }else if(smc == 2){
    chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  }else if(smc == 1){
    chars = '01234567890123456789012345678901234567890123456789';
  }
  let str = '';
  for (let i = 0; i < length; i++) {
      str += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return str;
};

function kode_Input(iddc){
  document.getElementById(iddc).addEventListener('keydown', (event) => {
    if(event.code === 'Digit1' && event.altKey){
      document.getElementById(iddc).value = random(10,1);
    }else if(event.code === 'KeyA' && event.altKey){
      document.getElementById(iddc).value = random(10,2);
    }else if (event.code === 'KeyR' && event.altKey) {
      document.getElementById(iddc).value = random(10,3);
    }
  });
}

function dateIput(iddc){
  var g;  
  var date = new Date();
  var jam = date.getHours();
  var menit = date.getMinutes();
  if(jam < 10){jam = "0"+jam}else{jam = jam;}
  if(menit < 10){menit = "0"+menit}else{menit = menit;}
  
  g = date.toISOString().substring(0,10)+"T"+jam+":"+menit;
  document.getElementById(iddc).addEventListener('keydown', (event) => {
    if (event.code === 'KeyT' && event.altKey) {
      document.getElementById(iddc).value = g;
    }
  });
}


function buatStruk(){
  var vm,rm;
  if(document.getElementById("kodeBlnj").value == "" || document.getElementById("kodeBlnj").value == "0"){document.getElementById("kodeBlnj").classList.add("is-invalid");}else{if(document.getElementById("kodeBlnj").classList.contains("is-invalid")){document.getElementById("kodeBlnj").classList.remove("is-invalid");}}
  if(document.getElementById("tanggalBlj").value == ""){document.getElementById("tanggalBlj").classList.add("is-invalid");}else{if(document.getElementById("tanggalBlj").classList.contains("is-invalid")){document.getElementById("tanggalBlj").classList.remove("is-invalid");}}
  if(document.getElementById("mpby").value == ""){document.getElementById("mpby").classList.add("is-invalid");}else{if(document.getElementById("mpby").classList.contains("is-invalid")){document.getElementById("mpby").classList.remove("is-invalid");}}
  if(document.getElementById("JumByr1").value == "" || document.getElementById("JumByr1").value == "0"){document.getElementById("JumByr1").classList.add("is-invalid");}else{if(document.getElementById("JumByr1").classList.contains("is-invalid")){document.getElementById("JumByr1").classList.remove("is-invalid");}}
  if(no_tabel == 0){
    window.alert("Belum Membuat Tabel Sama Sekali");
  }else{
    for(vm=1; vm <= no_tabel; vm++){
      vm = String(vm);
      if(document.getElementById("nd_"+vm).value == ""){document.getElementById("nd_"+vm).classList.add("is-invalid");}else{if(document.getElementById("nd_"+vm).classList.contains("is-invalid")){document.getElementById("nd_"+vm).classList.remove("is-invalid");}}
      if(document.getElementById("hd_"+vm).value == "" || document.getElementById("hd_"+vm).value == "0"){document.getElementById("hd_"+vm).classList.add("is-invalid");}else{if(document.getElementById("hd_"+vm).classList.contains("is-invalid")){document.getElementById("hd_"+vm).classList.remove("is-invalid");}}
      if(document.getElementById("jd_"+vm).value == "" || document.getElementById("jd_"+vm).value == "0"){document.getElementById("jd_"+vm).classList.add("is-invalid");}else{if(document.getElementById("jd_"+vm).classList.contains("is-invalid")){document.getElementById("jd_"+vm).classList.remove("is-invalid");}}
      // Validasi Input loop
      if(document.getElementById("nd_"+vm).value == "" || document.getElementById("hd_"+vm).value == "" || document.getElementById("jd_"+vm).value == "" || document.getElementById("hd_"+vm).value == "0" ||document.getElementById("jd_"+vm).value == "0"){return false;}
    }
  }
  if(document.getElementById("kodeBlnj").value == "" || document.getElementById("mpby").value == "" || document.getElementById("tanggalBlj").value == "" || document.getElementById("JumByr1").value == "" || document.getElementById("JumByr1").value == "0" || document.getElementById("kodeBlnj").value == "0"){return false;}
  if(document.getElementById("kembalianQwm").innerHTML == "Jumlah bayar masih kurang" || document.getElementById("kembalianQwm").innerHTML == "Masukan Uang"){
    document.getElementById("kembalianQwm").classList.add("bg-danger");
    return false;
  }else{
    if(document.getElementById("kembalianQwm").classList.contains("bg-danger")){
      document.getElementById("kembalianQwm").classList.remove("bg-danger");
    }
  }


  // Eksekusi Dan Ubah Semua Data Yang Ada Di Dalam ul
  var amsd = "";
  for(rm=1; rm <= no_tabel; rm++){
    amsd += '<li class="w-100 d-flex justify-content-between align-items-center mb-2"><span style="flex: 1;">'+document.getElementById('nd_'+String(rm)).value+' x'+document.getElementById('jd_'+String(rm)).value+'</span><span style="flex: 1;" class="text-end">'+rupiah(document.getElementById('td_'+String(rm)).innerHTML)+'</span></li>'
  }
  document.getElementById("data_struk").innerHTML = amsd;
  var tglSt = document.getElementById("tanggalBlj").value.split("T");
  document.getElementById("tglStruk").innerHTML = tglSt[0]+" "+tglSt[1];
  document.getElementById("kodeStruk").innerHTML = document.getElementById("kodeBlnj").value;
  document.getElementById("total_pembayaran_struk").innerHTML = rupiah(document.getElementById("kslrh").innerHTML);

  var gm = document.getElementById("diskon_ck");
  if(gm.value == "0" || gm.value == ""){gm = "Tidak ada";}else{gm = gm.value+"%";}
  document.getElementById("diskon_struk").innerHTML = gm;
  document.getElementById("total_semua").innerHTML = rupiah(document.getElementById("Ha_hide").innerHTML);
  document.getElementById("metode_struk").innerHTML = document.getElementById("mpby").value;
  document.getElementById("uang_struk").innerHTML = rupiah(document.getElementById("JumByr1").value);

  var yd = document.getElementById("kembalianQwm").innerHTML;
  if(yd == "Uang Pas"){yd = "Tidak Ada";}else{yd = yd;}
  document.getElementById("kembali_struk").innerHTML = yd;

  if(document.getElementById("boxStruk").classList.contains("d-none")){
    document.getElementById("boxStruk").classList.remove("d-none");
  }

  if(document.getElementById("qrcode").innerHTML != ""){document.getElementById("qrcode").innerHTML = "";}
  var qrcode = new QRCode(document.getElementById("qrcode"), {width : 70,height : 70});
  qrcode.makeCode(document.getElementById("kodeBlnj").value);
  document.getElementById("downloadImgBtn").onclick = () =>{
      var xdf;
      document.getElementById("capture").style.width = "500px !important";
      html2canvas(document.querySelector("#capture")).then(canvas => {
          canvas.id = "Mqw3492";            
          document.getElementById("buatImg").appendChild(canvas);
          var canvas = document.getElementById('Mqw3492');
          var dataURL = canvas.toDataURL();
          var xcm = document.getElementById("downloadImg");
          xcm.href = dataURL;
          var date = new Date();
          xcm.download="strukPembayaranByRovino"+date.toISOString().substring(0,10);
          xcm.click();
      });
  }
}