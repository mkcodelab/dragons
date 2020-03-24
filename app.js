

let mainAtkArr = ['strike','bite','smash','tail slam'];
    spcAtkArr = ['fire breath','poison breath', 'fire ball', 'acid shot'];
    skillsArr = [];
    races = [
        {raceName: 'Czarny Smok', desc: 'Czarne smoki są czarne i złe'},
        {raceName: 'Zielony Smok', desc: 'Zielone smoki jedzą brokuły'},
        {raceName: 'Złoty Smok', desc: 'Pracują u jubilera'},
        {raceName: 'Czerwony Smok', desc: 'Za dużo pije'},
    ];

    // testowa zawartosc slota ktora bede kopiowal do pustych slotów w instancji vue
    emptyDragonSlot = {
       
        selected: false,
        fighter: false,
        
        name:'Brak',
    };
let App = new Vue({
    el: '#app',

    data:{

        // Okienka --------------------------
        fight: false,
        win: false,
        defeat: false,

        breeding: false,
        resourcesWindow: false,
        draconologyWindow: false,
        expeditionWindow: false,
        nestWindow: false,
        eggsWindow: false,

        seeDragonWindow: false,
        shopWindow: false,
        // staty
        gold: 1000,
        crystals: 10,
        food: 20,
        attackClicked: false,

        // TWOJE SMOKI ---------------------------------------
        // NADPISUJ EMPTY DRAGON SLOT SMOKAMI Z TABLICY OBIEKTOW SMOKI. WSZYSTKO DZIAŁA
        yourDragons: [
            
            emptyDragonSlot,
            emptyDragonSlot,
            emptyDragonSlot,
            emptyDragonSlot,
            emptyDragonSlot,
            emptyDragonSlot,
            emptyDragonSlot,
            emptyDragonSlot,
    
        ],


        // ---------------------------------------------------------------------
        chosenDragon: 0,
        activeDragon: 0,
        // obiekt walczacego wybranego smoka
        player: {},
        // obiekt losowanego oponenta
        opponent:{},
    },
    methods:{
        updateStats: function(){
            this.opponent.hpPercent = Math.round((this.opponent.hp/this.opponent.maxHp)*100);
            this.player.hpPercent = Math.round((this.player.hp/this.player.maxHp)*100);
        },

        arenaFight(){
            // sprawdza czy wybrany zostal smok walczący
            if(JSON.stringify(this.player) === JSON.stringify({})){
                alert('Nie masz jeszcze smoka który może walczyć')
                return;
            }
            if(this.player.hp<=0){
                alert('Twój smok jest nieprzytomny. Musisz udać się do hodowli i go uleczyć!');
                return;
            }
            this.fight = true;
            this.randomEnemy();
        },
        opponentAttack(){
            // if(this.opponent.hp <= 0){
            //     this.opponent.hp = 0;
            //     this.win = true;
            //     return;
            // }
            let random = Math.round(Math.random()*20+1);
                baseDmg = random+this.opponent.str*this.opponent.spd;
                opDef = this.player.def;
                calcDmg = Math.round(baseDmg/opDef);
                
                console.log('przeciwnik zadał: '+calcDmg+'dmg');
                this.player.hp-=calcDmg;
                
            this.updateStats();
            if(this.player.hp<=0){
                // dodaj tu defeat screen
                alert('porażka');
                this.player.hp = 0;
                App.attackClicked = false;
                setTimeout(()=>{App.defeat = true;},1000);
                return;
            }
        },

        attack: function(){

            // if(this.opponent.hp <= 0){
            //     this.opponent.hp = 0;
            //     this.win = true;
            //     return;
            // }
            
            if(App.attackClicked == true){
                return;
            }
            this.attackClicked = true;
            let random = Math.round(Math.random()*20+1);
                baseDmg = random+this.player.str*this.player.spd;
                opDef = this.opponent.def;
                calcDmg = Math.round(baseDmg/opDef);
                
                
                console.log('zadałeś: '+calcDmg+'dmg');
                this.opponent.hp-=calcDmg;
                
            this.updateStats();

            if(this.opponent.hp <= 0){
                this.opponent.hp = 0;
                App.attackClicked = false;
                setTimeout(()=>{App.win = true;},1000);
                return;
            }
            
            setTimeout(function(){
                App.opponentAttack();
                App.attackClicked = false;
            },800);
        },
        spcAttack: function(){
            let baseDmg = 100;
        },
        recover(){
            this.player.hp = this.player.maxHp;
            this.opponent.hp = this.opponent.maxHp;
            this.updateStats();
        },
        defeatAccept(){
            // przypisuje obiekt player do listy posiadanych smokow, updatując staty 
            this.yourDragons[this.activeDragon] = this.player;
            this.defeat = false;
            this.fight = false;
            this.breeding = true;
            // dodaj zmniejszanie zasobow
        },
        collectPrizes : function(){
            // przypisuje obiekt player do listy posiadanych smokow, updatując staty 
            this.yourDragons[this.activeDragon] = this.player;
            this.win = false;
            this.fight = false;
            this.breeding = true;
            // this.recover();
        },
        // podgląd smoka którego masz w hodowli
        seeDragon(index){
            this.chosenDragon = index;
            if(this.yourDragons[index].selected==false)
            {
                console.log('Pusty Slot');
                return;
            }
            this.seeDragonWindow=true;

        },
        // jestem geniuszem bo rozwiązalem problem reaktywności za pomocą przypisania obiektu do tymczasowego obiektu
        // i podstawienia tymczasowego do obiektu opponent, oraz tak samo z player
        switchFighter(){
            this.activeDragon=this.chosenDragon;
            // forEach() zastosuj do ustawiania bool
            // this.yourDragons[0].fighter=false;
            // this.yourDragons[1].fighter=false;

            // usuwa klase fighter z kazdego smoka
            this.yourDragons.forEach((e)=>{
                e.fighter = false;
            });

            this.yourDragons[this.chosenDragon].fighter=true;
            // wywala błąd
            // proba podmianki obiektu player na obiekt yourDragon[wybrany]
            
            let temporaryFighter = Object.assign({}, this.yourDragons[this.chosenDragon]);
            this.player = temporaryFighter;
            // this.player = this.yourDragons[this.chosenDragon];
        },

        randomEnemy(){
            let random = Math.round(Math.random()*2);
            // this.opponent = DRAGONS[random];
            let temporaryEnemy = Object.assign({}, DRAGONS[random]);
            this.opponent = temporaryEnemy;
            // trzeba skopiować obiekt i przypisac go do oponenta, w tym wypadku ustawia oponent na dokladnie ten obiekt
        },
        addDragon(dragonId, slot){
            let tempDragon = Object.assign({},DRAGONS[dragonId]);
            if(this.yourDragons[slot]===emptyDragonSlot){
                this.yourDragons[slot]=tempDragon;
            }
            else{
                console.log('W slocie jest już smok');
                return;
            }
        },
        // nie dziaka ???
        removeDragon(slot){
            this.yourDragons[slot] = emptyDragonSlot;
        },
        // nie dziala ????
        clearDragonSlots(){
            for (var i = 0; i >=this.yourDragons.length-1;i++){
                console.log('usunięto');
                this.yourDragons[i] = emptyDragonSlot;
            }
        },
        healWounds(){
            let dragon = this.yourDragons[this.chosenDragon];
            if(this.food == 0){
                alert('nie masz już jedzenia by nakarmić smoka');
                return;
            }
            if(dragon.hp==dragon.maxHp){
                alert('twój smok jest w pełni sił');
                return;
            }
            if(dragon.hp>=dragon.maxHp){
                dragon.hp = dragon.maxHp;
                alert('uleczyłeś smoka');
                return;
            }
            dragon.hp+=10;
            this.updateStats();
            this.food --;
        },
        

    },

});
// dodaj punkty rozwoju np 1000 pkt, skill kosztuje 100, zdovywa sie je za walki itp