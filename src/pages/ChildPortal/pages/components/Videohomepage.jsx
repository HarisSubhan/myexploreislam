import React from 'react';
import { Container, Row, Col, Card, Badge } from 'react-bootstrap';


const videos = [
  {
    id: 1,
    title: 'Kaho Na Kaho slowed reverb (lofi)',
    channel: 'Harshit Saxena',
    views: '1.2M views',
    time: '2 days ago',
    duration: '3:20',
    thumbnail: 'https://picsum.photos/id/237/400/225',
  },
  {
    id: 2,
    title: 'Main Nagin Dance Full Video',
    channel: 'Anmol Malik',
    views: '42M views',
    time: 'Updated today',
    duration: '4:05',
    thumbnail: 'https://picsum.photos/id/238/400/225',
  },
  {
    id: 3,
    title: 'Sason ki Mala Pe (Remix)',
    channel: 'Nusrat Fateh Ali Khan',
    views: '900K views',
    time: '1 week ago',
    duration: '4:42',
    thumbnail: 'https://picsum.photos/id/239/400/225',
  },
  {
    id: 4,
    title: 'Nasha - Lofi Song',
    channel: 'Tamannaah B',
    views: '3M views',
    time: '1 month ago',
    duration: '3:24',
    thumbnail: 'https://picsum.photos/id/240/400/225',
  },
  {
    id: 5,
    title: 'Build Apps with GenAI',
    channel: 'OpenAI',
    views: '2.3M views',
    time: '3 days ago',
    duration: '2:01',
    thumbnail: 'https://picsum.photos/id/241/400/225',
  }
];

const VideoCard = ({ video }) => (
  <Card className="border-0">
    <div className="position-relative">
      <Card.Img variant="top" src={video.thumbnail} />
      <Badge
        bg="dark"
        className="position-absolute bottom-0 end-0 m-2"
        style={{ opacity: 0.85 }}
      >
        {video.duration}
      </Badge>
    </div>
    <Card.Body className="pt-2 px-1">
      <Card.Title style={{ fontSize: '0.95rem' }}>{video.title}</Card.Title>
      <Card.Text className="text-muted" style={{ fontSize: '0.85rem' }}>
        {video.channel}<br />
        {video.views} • {video.time}
      </Card.Text>
    </Card.Body>
  </Card>
);

export const VideoHomepage = () => (
    
  <Container className="py-4">

    <Row xs={1} sm={2} md={3} lg={4} className="g-4">
      {videos.map((vid) => (
        <Col key={vid.id}>
          <VideoCard video={vid} />
        </Col>
      ))}
    </Row>
  </Container>
);
