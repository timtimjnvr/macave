<h1 style="text-decoration: underline">Suivi de l'utilisation du module<h1>
<ul>
<li style="font-weight: light; display: flex; flex-direction: row">Nombre de clients utilisant la gestion de stock du module : 
 {foreach from=$nombre_clients item=v} 
 <div style="font-weight: bold; margin-left: 20px">{$v}</div>
 {/foreach}</li>
 <li style=" font-weight: light;  display: flex; flex-direction: row; margin-top: 20px">Nombre de bouteilles stockées : 
 {foreach from=$nombre_lignes item=v}
 <div style="font-weight: bold; margin-left: 20px">{$v}</div> 
 {/foreach}</li>
 </ul>
