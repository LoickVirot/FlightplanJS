class Itineraire {

  constructor(d, a, n) {
    this.depart = d;
    this.arrivee = a;
    this.distanceEtapes = n;
    this.listeEtapes = [d];
    this.nbEtapes = 0;
  }


  //Retourne la distance orthodromique entre la position et le point d'arrivee
  distanceOrtho(position) {
    //Points en radians
    var departLa = position[0] * Math.PI / 180;
    var departLo = position[1] * Math.PI / 180;
    var arriveeLa = this.arrivee[0] * Math.PI / 180;
    var arriveeLo = this.arrivee[1] * Math.PI / 180;

    var d = Math.acos((Math.sin(arriveeLa) * Math.sin(departLa)) + (Math.cos(departLa) * Math.cos(arriveeLa) * Math.cos(arriveeLo - departLo)));
    return d;
  }

  //Retourne le cap orthodromique pour aller de la position à l'arrivée
  calculerCap(position) {
    //Points en radians

    var departLa = position[0] * Math.PI / 180;
    var departLo = position[1] * Math.PI / 180;
    var arriveeLa = this.arrivee[0] * Math.PI / 180;
    var arriveeLo = this.arrivee[1] * Math.PI / 180;

    var g = arriveeLo - departLo;
    var d = this.distanceOrtho(position);

    var cap = Math.acos(
      (Math.sin(arriveeLa) - Math.sin(departLa) * Math.cos(d)) /
      (Math.cos(departLa) * Math.sin(d))
    )

    if (g <= 0) {
      cap = cap * -1;
    }

    return cap * 180 / Math.PI;

  }

  //Calcule la coordonnée d'une etape
  calculerEtape(origine, cap) {

    var laOrigine = origine[0];
    var loOrigine = origine[1];
    var laArrivee = laOrigine + (this.distanceEtapes * Math.cos(cap * Math.PI / 180)) / 60;
    var loArrivee = loOrigine + (this.distanceEtapes * Math.sin(cap * Math.PI / 180)) / (60 * Math.cos(laOrigine * Math.PI / 180));

    return [laArrivee, loArrivee];
  }

  //Return array of points and cap
  calculerItineraire(position) {
    if (this.nbEtapes * this.distanceEtapes >= (this.distanceOrtho(this.depart) * 180 / Math.PI) * 60 * 1.852) {
      return this.listeEtapes;
    }
    else {
      //calcul le cap a suivre
      var cap = this.calculerCap(position);

      //Ajoute la position et le cap à l'itineraire
      this.listeEtapes[this.nbEtapes] = [position, cap];
      this.nbEtapes += 1;

      //calcul une nouvelle etape
      var newPosition = this.calculerEtape(position, cap);

      //je calcul l'itineraire à partir de la prochaine etape
      this.calculerItineraire(newPosition);
    }
  }

  getItineraire() {
    this.calculerItineraire(this.depart)
    return this.listeEtapes
  }
}
