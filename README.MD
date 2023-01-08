# DATA 732 - PROJET

Pour lancer le serveur

```shell
npm install
npm start
```

# Dataset

Le dataset utilisé est le suivant :

https://www.kaggle.com/datasets/catherinerasgaitis/mxmh-survey-results


# Notre analyse

Premièrement, nous avons décidés de choisir le temps moyen d'écoute par jour en fonction de l'âge dans notre dashboard car nous pensions que les personnes très jeunes ou très âgées écoutaient moins de musique que les personnes entre l'adolescence et la fin de l'âge active.
De plus, le graphe du taux d'anxiété moyen en fonction du BPM a été choisi car nous voulions savoir si les personnes anxieuses écoutaient des musiques au tempo lent, rapide ou si cela n'avait aucun lien.

Ensuite, nous nous sommes posés la question du taux d'anxiété et de dépression au sein de la population du dataset en fonction de l'âge. 
Nous avons remarqué qu'il y a plus de personnes dépressives et anxieuses dans les personnes les plus jeunes. 
Or il y a aussi plus de personnes jeunes présentes dans le dataset.
Nous pouvons donc penser que la dépression et l'anxiété n'ont pas de corrélation directe avec l'âge.

En outre, nous avons voulu savoir si le cliché des jeunes qui écoutent de la musique en travaillant était vrai ou non. Le graphe nous montre que oui mais il faut prendre en compte la surreprésentation des jeunes (moins de 30 ans) dans le dataset.

Finalement, nous avons choisi de représenter la répartition des âges de cette base de données, car il semblait pertinent de savoir sur quel échantillon nous étudions nos données, de plus que nous savons qu'il y a une surreprésentation des moins de 30 ans dans le dataset.
Cela nous permet d'avoir un regard plus critique sur le rendu de nos données.
