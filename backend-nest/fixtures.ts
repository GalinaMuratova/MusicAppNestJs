import mongoose from 'mongoose';
import * as crypto from 'crypto';
import { ArtistSchema } from './src/schemas/artist.schema';
import { AlbumSchema } from './src/schemas/album.schema';
import { TrackSchema } from './src/schemas/tracks.schema';
import { UserSchema } from './src/schemas/user.schema';

const run = async () => {
  await mongoose.connect('mongodb://localhost/musicNest');
  const db = mongoose.connection;

  try {
    await db.dropCollection('artists');
    await db.dropCollection('albums');
    await db.dropCollection('tracks');
    await db.dropCollection('users');
  } catch (e) {
    console.log('Collection were not present');
  }

  const Artist = mongoose.model('Artist', ArtistSchema);
  const Album = mongoose.model('Album', AlbumSchema);
  const Track = mongoose.model('Track', TrackSchema);
  const User = mongoose.model('User', UserSchema);

  const [artist1, artist2] = await Artist.create(
    {
      name: 'Panic! At the disco',
      information:
        'Американская рок-группа из Лас-Вегаса, штат Невада. На данный момент единственным участником группы является Брендон Ури',
      image: '/uploads/artists/patd.jpeg',
    },
    {
      name: 'Pink floyd',
      information:
        'Британская рок-группа, знаменитая своими продолжительными композициями и объединёнными в тематические сюиты песнями, звуковыми экспериментами, философскими текстами, дизайном обложек альбомов и грандиозными концертными шоу.',
      image: '/uploads/artists/pinkfloyd.jpeg',
    },
  );

  const [album1, album2, album3, album4] = await Album.create(
    {
      name: 'Too Weird to Live, Too Rare to Die!',
      image: '/uploads/albums/tooweirdtolivetooraretodie.jpg',
      artist: artist1._id,
      year: 2013,
    },
    {
      name: 'A Fever You Can’t Sweat Out',
      image: '/uploads/albums/afeveryoucantsweatout.jpeg',
      artist: artist1._id,
      year: 2005,
    },
    {
      name: 'The Wall',
      image: '/uploads/albums/thewall.jpg',
      artist: artist2._id,
      year: 1979,
    },
    {
      name: 'The dark side of the moon',
      image: '/uploads/albums/thedarksideofthemoon.jpeg',
      artist: artist2._id,
      year: 1973,
    },
  );
  await Track.create(
    {
      name: 'This is Gospel',
      album: album1._id,
      duration: '3:07',
    },
    {
      name: 'Miss Jackson',
      album: album1._id,
      duration: '3:24',
    },
    {
      name: 'Far Too Young to Die',
      album: album1._id,
      duration: '3:17',
    },
    {
      name: 'Girl That You Love',
      album: album1._id,
      duration: '3:26',
    },
    {
      name: 'Casual Affair',
      album: album1._id,
      duration: '4:12',
    },
    {
      name: 'London Beckoned Songs About Money Written by Machines',
      album: album2._id,
      duration: '3:07',
    },
    {
      name: 'Nails for Breakfast, Tacks for Snacks',
      album: album2._id,
      duration: '3:24',
    },
    {
      name: 'I Write Sins Not Tragedies',
      album: album2._id,
      duration: '3:17',
    },
    {
      name: 'There’s a Good Reason These Tables Are Numbered Honey, You Just Haven’t Thought of It Yet',
      album: album2._id,
      duration: '3:26',
    },
    {
      name: 'I Constantly Thank God for Esteban',
      album: album2._id,
      duration: '4:12',
    },
    {
      name: 'Breathe (In the Air)',
      album: album3._id,
      duration: '3:07',
    },
    {
      name: 'On the Run',
      album: album3._id,
      duration: '3:24',
    },
    {
      name: 'The Great Gig in the Sky',
      album: album3._id,
      duration: '3:17',
    },
    {
      name: 'Any Colour You Like',
      album: album3._id,
      duration: '3:26',
    },
    {
      name: 'Eclipse',
      album: album3._id,
      duration: '4:12',
    },
    {
      name: 'Another Brick in the Wall',
      album: album4._id,
      duration: '3:07',
    },
    {
      name: 'Mother',
      album: album4._id,
      duration: '3:24',
    },
    {
      name: 'Goodbye Blue Sky',
      album: album4._id,
      duration: '3:17',
    },
    {
      name: 'Empty Spaces',
      album: album4._id,
      duration: '3:26',
    },
    {
      name: 'Don’t Leave Me Now',
      album: album4._id,
      duration: '4:12',
    },
  );
  await User.create(
    {
      username: 'Anna',
      password: '123',
      token: crypto.randomUUID(),
      role: 'admin',
      displayName: 'Anna Gavalda',
    },
    {
      username: 'Sam',
      password: '456',
      token: crypto.randomUUID(),
      role: 'user',
      displayName: 'Sam Smith',
    },
  );
  await db.close();
};
run().catch(console.error);
