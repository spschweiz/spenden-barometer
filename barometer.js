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
        console.log(this.data);
        let stats = this.data.result.facets[0].stats;
        console.log(stats);
        let amount_left = this.goal - (this.offline_amount + (parseInt(stats.total) / 100));
        let percentage = (1 - (amount_left / this.goal)) * 100;
        if(!this.baro_show_revenue && this.goal_backers != 0){
            percentage = (((this.offline_backers + stats.count) / this.goal_backers)) * 100;
        }
        
        
        let container = document.getElementById("barometer-container");
        let baro_border = document.createElement("div");
        let baro_progress = document.createElement("div");
        let baro_text_container = document.createElement("div");
        baro_border.classList.add("baro-border");
        baro_progress.classList.add("baro-progress");
        baro_text_container.classList.add("baro-text-container");
        
        
        baro_progress.style.width = `${percentage}%`
        baro_border.appendChild(baro_progress);
        
        if(this.show_donation_revenue){
            let baro_text_goal = document.createElement("p");
            baro_text_goal.classList.add("baro-text");
            let total = Math.floor(((stats.total / 100) + this.offline_amount)).toLocaleString("de-CH");

            if(this.lang == "de"){
                if(this.show_donation_revenue_with_goal){
                    baro_text_goal.innerHTML = `<b>${total}</b> von ${this.goal.toLocaleString("de-CH")} Franken gesammelt`;
                } else{
                    baro_text_goal.innerHTML = `<b>${total}</b> Franken gesammelt`;
                }
            } else if(this.lang == "fr"){
                if(this.show_donation_revenue_with_goal){
                    baro_text_goal.innerHTML = `<b>${total}</b> francs récoltés sur ${this.goal.toLocaleString("de-CH")}`;
                } else{
                    baro_text_goal.innerHTML = `<b>${total}</b> francs récoltés`;
                }
            } else {
                if(this.show_donation_revenue_with_goal){
                    baro_text_goal.innerHTML = `<b>${total}</b> franchi su ${this.goal.toLocaleString("de-CH")} raccolti`;                    
                } else{
                    baro_text_goal.innerHTML = `<b>${total}</b> franchi raccolti`;                    
                }
            }
    
            baro_text_container.appendChild(baro_text_goal);
        }
        container.appendChild(baro_border);
        container.appendChild(baro_text_container);

        if(this.donation_object.length > 0 && this.donation_object_price != 0 && this.show_text_donation_object){
            let donation_object_quantity = Math.floor(this.goal / this.donation_object_price);
            let baro_text_for_what = document.createElement("p");
            let amount_financed = Math.floor((this.offline_amount + (parseInt(stats.total) / 100)) / this.donation_object_price);

            if(this.lang == "de"){
                baro_text_for_what.innerHTML = `<b>${amount_financed}</b> von ${donation_object_quantity} ${this.donation_object[0]} finanziert`;
            } else if (this.lang == "fr"){
                baro_text_for_what.innerHTML = `<b>${amount_financed}</b> ${this.donation_object[1]} financés sur ${donation_object_quantity}`;
            } else{
                baro_text_for_what.innerHTML = `<b>${amount_financed}</b> ${this.donation_object[2]} su ${donation_object_quantity} finanziati`;
            }

            baro_text_container.appendChild(baro_text_for_what);
        }

        if(this.show_text_amount_backers){
            let baro_text_backers = document.createElement("p");
            
            if(this.lang == "de"){
                if(this.goal_backers > 0 && this.show_text_amount_backers_with_goal){
                    baro_text_backers.innerHTML = `<b>${stats.count + this.offline_backers}</b> von ${this.goal_backers} Spender:innen`;
                } else {
                    baro_text_backers.innerHTML = `<b>${stats.count + this.offline_backers}</b> Spender:innen`;
                }
            } else if (this.lang == "fr"){
                if(this.goal_backers > 0 && this.show_text_amount_backers_with_goal){
                    baro_text_backers.innerHTML = `<b>${stats.count + this.offline_backers}</b> sur ${this.goal_backers} donateurs:-trices`;
                } else{
                    baro_text_backers.innerHTML = `<b>${stats.count + this.offline_backers}</b> donateurs:-trices`;
                }
            } else{
                if(this.goal_backers > 0 && this.show_text_amount_backers_with_goal){
                    baro_text_backers.innerHTML = `<b>${stats.count + this.offline_backers}</b> su ${this.goal_backers} donatori`;                    
                } else {
                    baro_text_backers.innerHTML = `<b>${stats.count + this.offline_backers}</b> donatori`;                    
                }
            }
            
            baro_text_container.appendChild(baro_text_backers);
        } 

        if(this.mean){
            let mean = Math.round(stats.total / (this.offline_backers + stats.count));
            let baro_text_mean = document.createElement("p");
            
            if(this.lang == "de"){
                baro_text_mean.innerHTML = `<b>${mean.toLocaleString("de-CH")}</b> Franken Durchschnittsspende`;
            } else if (this.lang == "fr"){
                baro_text_mean.innerHTML = `<b>${mean.toLocaleString("de-CH")}</b> francs de don moyen`;
            } else {
                baro_text_mean.innerHTML = `<b>${mean.toLocaleString("de-CH")}</b> franchi donazione media`;
            }
            
            baro_text_container.appendChild(baro_text_mean);
        }

        if(this.show_days_remaining && this.end_date != ""){
            let baro_text_remaining = document.createElement("p");
            console.log(this.end_date);
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
    }
}