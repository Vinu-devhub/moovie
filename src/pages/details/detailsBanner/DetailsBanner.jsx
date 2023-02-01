import dayjs from 'dayjs';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import './detailsBanner.scss';

import PosterFallback from '../../../assets/no-poster.png';
import CircleRating from '../../../components/circleRating.jsx/CircleRating';
import ContentWrapper from '../../../components/contentWrapper/ContentWrapper';
// import Genres from '../../../components/genres/Genres';
import Img from '../../../components/lazyLoadImage/Img.jsx';
import VideoPopup from '../../../components/videoPopup/VideoPopup';
import useFetch from '../../../hooks/useFetch';
import { PlayIcon } from '../PlayBtn';

const DetailsBanner = ({ video, crew }) => {
  const [show, setShow] = useState(false);
  const [videoId, setVideoId] = useState(null);

  const { mediaType, id } = useParams();
  const { data, loading } = useFetch(`/${mediaType}/${id}`);

  const { url } = useSelector((state) => state.home);

  const directors = crew?.filter((d) => d.job === 'Director');

  const writers = crew?.filter(
    (w) => w.job === 'ScreenPlay' || w.job === 'Story' || w.job === 'Writer',
  );

  const toHoursAndMinutes = (totalMinutes) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h${minutes > 0 ? ` ${minutes}m` : ''}`;
  };

  return (
    <div className='detailsBanner'>
      {!loading ? (
        <>
          {!!data && (
            <React.Fragment>
              <div className='backdrop-img'>
                <Img src={url.backdrop + data?.backdrop_path} />
              </div>
              <div className='opacity-layer'></div>
              <ContentWrapper>
                <div className='content'>
                  <div className='left'>
                    {data.poster_path ? (
                      <Img
                        className='posterImg'
                        src={url.backdrop + data.poster_path}
                      />
                    ) : (
                      <Img className='posterImg' src={PosterFallback} />
                    )}
                  </div>
                  <div className='right'>
                    <div className='title'>
                      {`${data.name || data.title} (${dayjs(
                        data.release_date,
                      ).format('YYYY')})`}
                    </div>
                    <div className='subtitle'>{data.tagline}</div>
                    <div className='row'>
                      <CircleRating rating={data.vote_average.toFixed(1)} />
                      <div
                        className='playbtn'
                        onClick={() => {
                          setShow(true);
                          setVideoId(video.key);
                        }}
                      >
                        <PlayIcon />
                        <span className='text'>Watch Trailer</span>
                      </div>
                    </div>
                    <div className='overview'>
                      <div className='heading'>Overview</div>
                      <div className='description'>{data.overview}</div>
                    </div>
                    <div className='info'>
                      {data.status && (
                        <div className='infoItem'>
                          <span className='text bold'>Status: </span>
                          <div className='text'>{data.status}</div>
                        </div>
                      )}
                      {data.release_date && (
                        <div className='infoItem'>
                          <span className='text bold'>Release Date: </span>
                          <div className='text'>
                            {dayjs(data.release_date).format('MMM D,YYYY')}
                          </div>
                        </div>
                      )}
                      {data.runtime && (
                        <div className='infoItem'>
                          <span className='text bold'>Runtime: </span>
                          <div className='text'>
                            {toHoursAndMinutes(data.runtime)}
                          </div>
                        </div>
                      )}
                    </div>

                    {directors?.length > 0 && (
                      <div className='info'>
                        <span className='text bold'>Director: </span>
                        <span className='text'>
                          {directors.map((dir, i) => (
                            <span key={i}>
                              {dir.name}
                              {directors.length - 1 !== i && ', '}
                            </span>
                          ))}
                        </span>
                      </div>
                    )}
                    {writers?.length > 0 && (
                      <div className='info'>
                        <span className='text bold'>Writer: </span>
                        <span className='text'>
                          {writers.map((w, i) => (
                            <span key={i}>
                              {w.name}
                              {writers.length - 1 !== i && ', '}
                            </span>
                          ))}
                        </span>
                      </div>
                    )}
                    {data?.created_by?.length > 0 && (
                      <div className='info'>
                        <span className='text bold'>Creator: </span>
                        <span className='text'>
                          {data?.created_by.map((w, i) => (
                            <span key={i}>
                              {w.name}
                              {data?.created_by.length - 1 !== i && ', '}
                            </span>
                          ))}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <VideoPopup
                  show={show}
                  setShow={setShow}
                  videoId={videoId}
                  setVideoId={setVideoId}
                />
              </ContentWrapper>
            </React.Fragment>
          )}
        </>
      ) : (
        <div className='detailsBannerSkeleton'>
          <ContentWrapper>
            <div className='left skeleton'></div>
            <div className='right'>
              <div className='row skeleton'></div>
              <div className='row skeleton'></div>
              <div className='row skeleton'></div>
              <div className='row skeleton'></div>
              <div className='row skeleton'></div>
              <div className='row skeleton'></div>
              <div className='row skeleton'></div>
            </div>
          </ContentWrapper>
        </div>
      )}
    </div>
  );
};

export default DetailsBanner;
