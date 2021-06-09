# 🏎️ @pmndrs/racing-game

![img](thumbnail.webp)

Live demo (current state): https://racing.pmnd.rs/

This project is a showcase for the feasibility of react in gaming. We would like to develop it open source, anyone can participate. If you have a PR merged you gain access as a co-contributor/maintainer. :-)

```jsx
/utils    - game state store, helpers
/models   - gltfjsx models, players, characters
/effects  - dust, trails, skids, shaders
/ui       - intros, heads up displays, leaderboards
```

There is a dedicated discord channel for this project here: https://discord.gg/rT5xGNjn

## Regarding assets

The folder assets contains **\*.blend** files used by this project.
They are a bit heavy, so they have been moved to git-lfs.
You can still access them, but you need first to install [git-lfs](https://git-lfs.github.com/),
and then, if after cloning the repository you cannot find them, just run the following commands:

```bash
git lfs fetch
git lfs pull
```
