class Barometer {
    constructor(
        goal = 0, 
        lang = "de", 
        baro_show_revenue = true, 
        show_donation_revenue = true, 
        show_donation_revenue_with_goal = true, 
        show_text_donation_object = false, 
        show_text_amount_backers = false,
        show_text_amount_backers_with_goal = false,
        offline_amount = 0, 
        offline_backers = 0, 
        campaign = "", 
        goal_backers = 0, 
        donation_object = [], 
        donation_object_price = 0, 
        mean = false, 
        end_date = "",
        show_days_remaining = false
        ){
            this.data = {};
            this.goal = goal;
            this.lang = lang;
            this.baro_show_revenue = baro_show_revenue;
            this.show_donation_revenue = show_donation_revenue;
            this.show_donation_revenue_with_goal = show_donation_revenue_with_goal;
            this.show_text_donation_object = show_text_donation_object;
            this.show_text_amount_backers = show_text_amount_backers;
            this.show_text_amount_backers_with_goal = show_text_amount_backers_with_goal;
            this.offline_amount = offline_amount;
            this.offline_backers = offline_backers;
            this.campaign = campaign;
            this.campaign_is_id;
            this.goal_backers = goal_backers;
            this.donation_object = donation_object;
            this.donation_object_price = donation_object_price;
            this.mean = mean;
            this.end_date = end_date;
            this.show_days_remaining = show_days_remaining;
        }

    async render(){
        await fetch(`https://tel.sp-ps.ch/raisenow/barometer/${this.campaign}/${this.campaign_is_id}`)
            .then(response => response.json())
            .then(data => this.data = data);
        let stats = this.data.result.facets[0].stats;
        let amount_left = this.goal - (this.offline_amount + (parseInt(stats.total) / 100));
        let percentage = (1 - (amount_left / this.goal)) * 100;
        if(!this.baro_show_revenue && this.goal_backers != 0){
            percentage = (((this.offline_backers + stats.count) / this.goal_backers)) * 100;
        }
        document.documentElement.style.setProperty('--progress-width', `${percentage}%`);
        
        
        let container = document.getElementById("barometer-container");
        let baro_border = document.createElement("div");
        let baro_progress = document.createElement("div");
        let baro_text_container = document.createElement("div");
        baro_border.classList.add("baro-border");
        baro_progress.classList.add("baro-progress");
        baro_text_container.classList.add("baro-text-container");
        
       // baro_progress.style.width = `${percentage}%`
        baro_border.appendChild(baro_progress);
        
        if(this.show_donation_revenue){
            let baro_text_goal = document.createElement("p");
            baro_text_goal.classList.add("baro-text");
            baro_text_goal.classList.add("baro-text-donation-revenue");

            let total = Math.floor(((stats.total / 100) + this.offline_amount)).toLocaleString("de-CH");

            if(this.lang == "de"){
                if(this.show_donation_revenue_with_goal){
                    baro_text_goal.innerHTML = `<b>${total}</b> von ${this.goal.toLocaleString("de-CH")} Franken gesammelt`;
                } else{
                    baro_text_goal.innerHTML = `<b>${total}</b> Franken gesammelt`;
                }
            } else if(this.lang == "fr"){
                if(this.show_donation_revenue_with_goal){
                    baro_text_goal.innerHTML = `<b>${total}</b> francs sur ${this.goal.toLocaleString("de-CH")} récoltés`;
                } else{
                    baro_text_goal.innerHTML = `<b>${total}</b> francs récoltés`;
                }
            } else {
                if(this.show_donation_revenue_with_goal){
                    baro_text_goal.innerHTML = `Raccolti <b>${total}</b> di ${this.goal.toLocaleString("de-CH")} franchi`;                    
                } else{
                    baro_text_goal.innerHTML = `<b>${total}</b> franchi raccolti`;                    
                }
            }
    
            baro_text_container.appendChild(baro_text_goal);
        }
        container.appendChild(baro_border);
        container.appendChild(baro_text_container);

        if(this.donation_object.length > 0 && this.donation_object_price != 0 && this.show_text_donation_object){
            let donation_object_quantity = (Math.floor(this.goal / this.donation_object_price)).toLocaleString("de-CH");
            let baro_text_for_what = document.createElement("p");
            baro_text_for_what.classList.add("baro-text");
            baro_text_for_what.classList.add("baro-text-object_quantity");

            let amount_financed = (Math.floor((this.offline_amount + (parseInt(stats.total) / 100)) / this.donation_object_price)).toLocaleString("de-CH");

            if(this.lang == "de"){
                baro_text_for_what.innerHTML = `<b>${amount_financed}</b> von ${donation_object_quantity} ${this.donation_object[0]} finanziert`;
            } else if (this.lang == "fr"){
                baro_text_for_what.innerHTML = `<b>${amount_financed}</b> ${this.donation_object[1]} sur ${donation_object_quantity} financés`;
            } else{
                baro_text_for_what.innerHTML = `Finanziati <b>${amount_financed}</b> di ${donation_object_quantity} ${this.donation_object[2]}`;
            }

            baro_text_container.appendChild(baro_text_for_what);
        }

        if(this.show_text_amount_backers){
            let baro_text_backers = document.createElement("p");
            baro_text_backers.classList.add("baro-text");
            baro_text_backers.classList.add("baro-text-backers");
            let count_backers = (stats.count + this.offline_backers).toLocaleString("de-CH");

            if(this.lang == "de"){
                if(this.goal_backers > 0 && this.show_text_amount_backers_with_goal){
                    baro_text_backers.innerHTML = `<b>${count_backers}</b> von ${this.goal_backers} Spender:innen`;
                } else {
                    baro_text_backers.innerHTML = `<b>${count_backers}</b> Spender:innen`;
                }
            } else if (this.lang == "fr"){
                if(this.goal_backers > 0 && this.show_text_amount_backers_with_goal){
                    baro_text_backers.innerHTML = `<b>${count_backers}</b> donateur-trices sur ${this.goal_backers}`;
                } else{
                    baro_text_backers.innerHTML = `<b>${count_backers}</b> donateur-trices`;
                }
            } else{
                if(this.goal_backers > 0 && this.show_text_amount_backers_with_goal){
                    baro_text_backers.innerHTML = `<b>${count_backers}</b> di ${this.goal_backers} donatori e donatrici`;                    
                } else {
                    baro_text_backers.innerHTML = `<b>${count_backers}</b> donatori e donatrici`;                    
                }
            }
            baro_text_container.appendChild(baro_text_backers);
        } 

        if(this.mean){
            let mean = ((Math.round(stats.total / (this.offline_backers + stats.count))) / 100).toLocaleString("de-CH");
            let baro_text_mean = document.createElement("p");
            baro_text_mean.classList.add("baro-text");
            baro_text_mean.classList.add("baro-text-mean");


            if(this.lang == "de"){
                baro_text_mean.innerHTML = `<b>${mean}</b> Franken Durchschnittsspende`;
            } else if (this.lang == "fr"){
                baro_text_mean.innerHTML = `Don moyen : <b>${mean}</b> francs`;
            } else {
                baro_text_mean.innerHTML = `Donazione media di <b>${mean}</b> franchi`;
            }
            
            baro_text_container.appendChild(baro_text_mean);
        }

        if(this.show_days_remaining && this.end_date != ""){
            let baro_text_remaining = document.createElement("p");
            baro_text_remaining.classList.add("baro-text");
            baro_text_remaining.classList.add("baro-text-days-remaining");

            let end_date = Date.parse(this.end_date);
            let today = new Date();

            let days = 0;
            if(today < end_date){
                let diffMili = Math.abs(end_date - today);
                days = Math.ceil(diffMili / (1000 * 60 * 60 * 24));
            }
            if(this.lang == "de"){
                baro_text_remaining.innerHTML = `<b>${days}</b> Tage verbleibend`;
            } else if (this.lang == "fr"){
                baro_text_remaining.innerHTML = `<b>${days}</b> jours restants`;
            } else {
                baro_text_remaining.innerHTML = `<b>${days}</b> giorni rimanenti`;
            }
            baro_text_container.appendChild(baro_text_remaining);
        }

        //FORCE RELOAD OF CSS AND JS TO IGNORE CACHED FILE (...AT LEAST ONCE A DAY)
        let today = new Date();
        let date = today.toLocaleDateString().replaceAll("/", "-");
        let hour = today.getHours();
        document.getElementById("js").src += "?" + `${date}-${hour}`;
        document.getElementById("css").href += "?" +`${date}-${hour}`;
    }
}
