class App {
  constructor() {
    // this.clearButton = document.getElementById("clear-btn");
    // this.loadButton = document.getElementById("load-btn");
    this.carContainerElement = document.getElementById("car-list");
    this.filterTipeDriver = document.getElementById("filter-type-driver");
    this.filterTanggal = document.getElementById("filter-tanggal");
    this.filterWaktu = document.getElementById("filter-waktu");
    this.filterJumlahPenumpang = document.getElementById(
      "filter-jumlah-penumpang"
    );
    this.submitButton = document.getElementById("submit-car");
    this.submitForm = document.getElementById("form-car");

    // Tambahkan event listener ke input tipe driver, tanggal, dan waktu untuk memeriksa apakah tombol harus dinonaktifkan.
    this.filterTipeDriver.addEventListener("change", () =>
      this.checkSubmitButtonState()
    );
    this.filterTanggal.addEventListener("change", () =>
      this.checkSubmitButtonState()
    );
    this.filterWaktu.addEventListener("change", () =>
      this.checkSubmitButtonState()
    );

    // this.submitForm.addEventListener("click", () => this.filterCars());
    this.submitForm.addEventListener("submit", (event) => {
      event.preventDefault(); // Mencegah reload halaman
      this.filterCars();
    });

    this.formInputs = document.querySelectorAll("input, select");

    this.formInputs.forEach((input) => {
      input.addEventListener("focus", () => {
        // Saat form input mendapatkan fokus, tampilkan overlay gelap
        document.getElementById("overlay").style.display = "block";
      });

      input.addEventListener("blur", () => {
        // Saat form input kehilangan fokus, sembunyikan overlay gelap
        document.getElementById("overlay").style.display = "none";
      });
    });
  }

  async init() {
    await this.load();

    // Register click listener
    //   this.clearButton.onclick = this.clear;
    //   this.loadButton.onclick = this.run;
  }

  run = () => {
    let cardHtml = "";
    const cars = Car.list.length;
    for (let i = 0; i < cars; i++) {
      const carList = Car.list[i];

      if (i % 3 === 0) {
        if (i > 0) {
          cardHtml += "</div>";
        }
        cardHtml += '<div class="row mb-4">';
      }

      cardHtml += carList.render();

      if (i === cars - 1) {
        cardHtml += "</div>";
      }
    }

    const listCar = document.createElement("div");
    listCar.innerHTML = cardHtml;
    this.carContainerElement.appendChild(listCar);
  };

  async load() {
    const cars = await Binar.listCars();
    Car.init(cars);
  }

  clear = () => {
    let child = this.carContainerElement.firstElementChild;

    while (child) {
      child.remove();
      child = this.carContainerElement.firstElementChild;
    }

    this.filterJumlahPenumpang.value = "";
    this.filterTanggal.value = "";
    this.filterWaktu.value = "";
    this.filterTipeDriver.value = "";
    this.submitButton.disabled = true;
  };

  checkSubmitButtonState() {
    // Dapatkan nilai input tipe driver, tanggal, dan waktu
    const tipeDriverValue = this.filterTipeDriver.value;
    const tanggalValue = this.filterTanggal.value;
    const waktuValue = this.filterWaktu.value;

    // Cek jika salah satu input kosong, maka nonaktifkan tombol "Cari Mobil"
    if (!tipeDriverValue || !tanggalValue || !waktuValue) {
      this.submitButton.disabled = true;
    } else {
      this.submitButton.disabled = false;
    }
  }

  renderCars(cars) {
    let cardHtml = "";
    const carsCount = cars.length;
    console.log(carsCount);
    for (let i = 0; i < carsCount; i++) {
      const car = cars[i];

      if (i % 3 === 0) {
        if (i > 0) {
          cardHtml += "</div>";
        }
        cardHtml += '<div class="row mb-4">';
      }

      cardHtml += car.render();

      if (i === carsCount - 1) {
        cardHtml += "</div>";
      }
    }

    const listCar = document.createElement("div");
    listCar.innerHTML = cardHtml;
    this.carContainerElement.appendChild(listCar);
  }

  filterCars() {
    // Dapatkan nilai input tipe driver, tanggal, dan waktu
    const tipeDriverValue = this.filterTipeDriver.value;
    const tanggalValue = this.filterTanggal.value;
    const waktuValue = this.filterWaktu.value;

    // Dapatkan nilai input jumlah penumpang (opsional)
    const jumlahPenumpangValue = this.filterJumlahPenumpang.value;

    // Konversi tanggal input ke format yang sesuai (misalnya, "2023-03-01 12:00")
    const inputDateTime = new Date(tanggalValue + " " + waktuValue);

    console.log(`inputDateTime: ${inputDateTime}`);

    // Dapatkan daftar mobil yang tersedia
    const filteredCars = Car.list.filter((car) => {
      // Konversi car.availableAt ke format yang sesuai
      const availableDateTime = new Date(car.availableAt);

      console.log(`availableDateTime: ${availableDateTime}`);

      // Bandingkan inputDateTime dengan availableDateTime (tanggal dan waktu wajib)
      const isDateValid = inputDateTime > availableDateTime;

      // Jika jumlah penumpang tidak kosong, bandingkan juga jumlah penumpang
      const isPassengerValid =
        !jumlahPenumpangValue ||
        car.capacity === parseInt(jumlahPenumpangValue);

      return isDateValid && isPassengerValid;
    });

    // Hapus mobil-mobil yang ada di tampilan sebelumnya
    this.clear();

    // Render mobil-mobil yang memenuhi kriteria
    this.renderCars(filteredCars);
  }

  //   filterCars() {
  //     // Dapatkan nilai input jumlah penumpang
  //     const jumlahPenumpangValue = this.filterJumlahPenumpang.value;

  //     console.log(`jumlahPenumpangValue : ${jumlahPenumpangValue}`);

  //     // Dapatkan semua mobil yang sesuai dengan kriteria filter
  //     const filteredCars = Car.list.filter((car) => {
  //       // Ubah jumlahPenumpangValue ke integer (angka bulat)
  //       const selectedJumlahPenumpang = parseInt(jumlahPenumpangValue);

  //       console.log(`car PenumpangValue : ${car.availableAt}`);

  //       // Bandingkan jumlah penumpang mobil dengan jumlah penumpang yang dipilih
  //       return car.capacity === selectedJumlahPenumpang;
  //     });

  //     // Bersihkan tampilan mobil sebelum menampilkan mobil yang difilter
  //     this.clear();

  //     // Tampilkan mobil yang sesuai dengan kriteria filter
  //     this.renderCars(filteredCars);
  //   }

  //   filterCars() {
  //     // Dapatkan nilai input tipe driver, tanggal, dan waktu
  //     const tipeDriverValue = this.filterTipeDriver.value;
  //     const tanggalValue = this.filterTanggal.value;
  //     const waktuValue = this.filterWaktu.value;

  //     // Konversi tanggal input ke format yang sesuai (misalnya, "2023-03-01 12:00")
  //     const inputDateTime = new Date(tanggalValue + " " + waktuValue);

  //     console.log(`inputDateTime : ${inputDateTime}`);

  //     // Dapatkan daftar mobil yang tersedia
  //     const availableCars = Car.list.filter((car) => {
  //       // Konversi car.availableAt ke format yang sesuai
  //       const availableDateTime = new Date(car.availableAt);

  //       console.log(`availableDateTime : ${availableDateTime}`);

  //       // Bandingkan inputDateTime dengan availableDateTime
  //       return inputDateTime > availableDateTime;
  //     });

  //     // Hapus mobil-mobil yang ada di tampilan sebelumnya
  //     this.clear();

  //     // Render mobil-mobil yang memenuhi kriteria
  //     this.renderCars(availableCars);
  //   }
}
