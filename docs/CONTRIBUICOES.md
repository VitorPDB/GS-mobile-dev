# Fluxo de contribuição

Para trabalhar em uma alteração:

~~~sh
git clone https://github.com/VitorPDB/GS-mobile-dev.git
cd GS-mobile-dev
git switch -c melhoria/descricao-curta
~~~

Depois de implementar e verificar o resultado:

~~~sh
git diff
git add caminho/do/arquivo
git commit -m "Descreve a alteração realizada"
git push -u origin melhoria/descricao-curta
~~~

Abra uma pull request para revisão. Cada integrante deve usar sua própria identidade Git. O README mantém os nomes e RMs do grupo.