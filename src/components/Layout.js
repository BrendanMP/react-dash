import React, { Component } from "react";
import { ReactComponent as COA } from "../images/COA.svg";
import { ReactComponent as Dashboard } from "../images/dashboard.svg";
import { ReactComponent as Map } from "../images/map.svg";
import { ReactComponent as ArrowRight } from "../images/arrow-right.svg";

import Fullscreen from "./deck/Fullscreen";

class Layout extends Component {
  render() {
    return (
      <div className="page">
        <nav className="page__icon-nav">
          <COA />
          <ul className="list-unstyled">
            <li>
              <button className="btn active">
                <Map />
              </button>
            </li>
            <li>
              <button className="btn">
                <Dashboard />
              </button>
            </li>
          </ul>
          <footer>
            <button className="btn">
              <ArrowRight />
            </button>
          </footer>
        </nav>
        <nav className="page__button-nav">
          <button className="btn active">Accidents</button>
          <button className="btn">Fatalities</button>
          <button className="btn">Response Time</button>
          <button className="btn">No Response</button>
        </nav>
        <main className="page__content">
          <header className="d-flex align-items-center">
            <div className="flex-grow-1 d-flex align-items-center">
              <strong className="text-uppercase">Page Title</strong>
            </div>
            <nav className="page__controls">
              <button className="btn px-1">
                <Fullscreen />
              </button>
              <button className="btn px-1">
                <Fullscreen />
              </button>
              <button className="btn px-1">
                <Fullscreen />
              </button>
              <button className="btn px-1">
                <Fullscreen />
              </button>
            </nav>
          </header>
          <section>
            <p className="lead">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab,
              asperiores beatae, deserunt dolorem esse fugiat harum iusto minima
              nobis numquam pariatur possimus quaerat reprehenderit repudiandae
              sed soluta veniam veritatis vitae? Atque consequatur consequuntur
              corporis eum eveniet facere illo, magnam nesciunt perspiciatis
              reiciendis repellendus saepe, sint vel velit, vero vitae
              voluptatem?
            </p>
            <p className="lead">
              A aliquam amet aspernatur atque commodi consequatur cumque
              cupiditate dicta dolorem doloremque ducimus ex facere hic illo
              inventore iure laudantium magnam minima modi nihil numquam officia
              omnis, quibusdam quis quo quod recusandae reiciendis repellendus
              sequi sint tempora tenetur ut vitae! Ab amet dolor doloremque
              facilis non officia quas sed sint.
            </p>
            <p className="lead">
              Molestiae mollitia nihil nulla? A accusantium ad alias asperiores,
              culpa cum, deserunt dolorum ducimus eius excepturi illo iure iusto
              odio porro quos repudiandae sint tempore! Ad beatae commodi culpa
              distinctio, ducimus exercitationem inventore iusto labore nemo
              nisi numquam officia perspiciatis quia vero voluptatem! Aliquam
              aut, enim iure laboriosam praesentium sint?
            </p>
            <p className="lead">
              Asperiores eaque esse eum explicabo minima, nihil obcaecati, odit
              quae quia reiciendis repellat sapiente tenetur voluptatem!
              Assumenda at eveniet ex excepturi id ipsa iste laborum officiis
              omnis quis recusandae sunt suscipit ut voluptas, voluptates!
              Architecto deleniti deserunt eaque, nesciunt nostrum odio rem
              repellat! Adipisci earum, eveniet hic soluta tempora ut!
            </p>
            <p className="lead">
              Quaerat quis repudiandae sequi? Doloribus inventore officiis
              praesentium quas sunt. Amet hic iusto quae. Accusantium adipisci
              aspernatur ex fugiat id ipsum qui quidem totam velit voluptates! A
              commodi consectetur consequatur delectus dicta doloremque
              doloribus esse fuga, impedit, laboriosam minima nostrum omnis
              placeat quasi qui quos rerum sed vel veritatis voluptatibus.
            </p>
            <p className="lead">
              Cumque magnam, quasi. Accusantium adipisci aperiam assumenda aut
              cum deleniti doloremque, enim libero minus nulla officiis pariatur
              quae quam quas quos, reprehenderit sit veniam? Blanditiis eveniet
              laboriosam voluptatum! Est explicabo fuga ipsum natus obcaecati
              qui quis quo repudiandae. Aspernatur assumenda atque culpa earum
              esse, excepturi fuga odio perspiciatis quidem vitae.
            </p>
            <p className="lead">
              Consequuntur delectus harum itaque libero odit omnis quia soluta
              vel veniam voluptatem. Animi consequuntur cumque dicta facilis in,
              iste neque sit temporibus voluptatibus! Debitis reiciendis, velit?
              Consequatur deserunt distinctio, esse expedita fuga fugiat impedit
              inventore natus nemo optio provident quae quod quos temporibus
              voluptatem. Ad dolor enim eveniet impedit maxime.
            </p>
            <p className="lead">
              Animi est, fugiat laborum magnam quas repellat repellendus.
              Aliquam aliquid architecto assumenda cupiditate doloremque
              doloribus dolorum ducimus eaque eligendi est et facere, fuga ipsa
              ipsum maxime minus molestiae natus nesciunt nulla, officiis
              perspiciatis placeat possimus provident quam quas qui quis quo
              recusandae sequi sunt tenetur vel veniam voluptatibus! Eum,
              voluptate.
            </p>
            <p className="lead">
              Ab, aliquid excepturi exercitationem impedit labore nisi quibusdam
              quo tempore vitae? Eos facilis nostrum odit officiis repellendus.
              Alias autem consequatur cum deserunt dignissimos dolore ea enim
              exercitationem fugiat harum id ipsa laudantium minus,
              necessitatibus nostrum odio odit perspiciatis praesentium
              provident quas quo quos reiciendis repudiandae sed sit suscipit
              unde vero?
            </p>
            <p className="lead">
              A accusamus aut distinctio doloremque ducimus, enim et eveniet
              facere, illum ipsum itaque iure laborum minima necessitatibus
              neque nobis non obcaecati praesentium quaerat qui quisquam saepe
              sapiente velit? Ad assumenda et eveniet nisi numquam quaerat ut.
              Culpa, doloremque earum enim esse fuga illum iure natus nihil quam
              quas recusandae, totam?
            </p>
            <p className="lead">
              Laborum minus nemo praesentium. Nihil, sint, sit! Alias aspernatur
              assumenda beatae, commodi consequatur dolor, dolorem doloribus
              dolorum ducimus eos esse ex fuga illo impedit ipsa itaque iusto
              minus natus nulla pariatur perferendis praesentium quas quia
              quisquam quo repellendus rerum saepe sapiente similique sint sunt
              temporibus ullam unde velit voluptas voluptatum.
            </p>
            <p className="lead">
              Ab blanditiis cumque dicta dolor esse iure, modi molestiae neque
              obcaecati odio, officia optio porro quo repellat temporibus
              tenetur voluptatum? Dolore dolorem earum est illum ipsam nemo
              officiis. Consectetur et itaque soluta. Ab alias deleniti iste
              numquam quam quidem soluta. Adipisci atque perferendis reiciendis?
              Doloribus hic minima omnis quidem repellat?
            </p>
            <p className="lead">
              Accusamus accusantium asperiores at beatae debitis error eveniet
              exercitationem, fugit harum, inventore iste iusto labore
              laboriosam, maiores nisi non odit omnis praesentium quam quidem
              reprehenderit saepe sapiente tenetur ullam unde ut veniam. A amet
              consectetur dolore eius harum itaque magnam magni nostrum
              quibusdam. Dolor dolore eaque facere quod totam, veritatis.
            </p>
            <p className="lead">
              Alias autem dolorem ducimus, ea fuga harum hic inventore
              necessitatibus nihil odio placeat porro quas quia ratione repellat
              veritatis voluptates! Dolorum provident quos repudiandae
              voluptates voluptatum. Accusantium aspernatur culpa debitis
              deleniti ducimus eligendi ipsa, laudantium nemo nobis nostrum
              placeat quas quibusdam quidem repellendus voluptas? Beatae eius
              illum mollitia veniam! Unde.
            </p>
            <p className="lead">
              Adipisci ea ratione voluptatum. Ab debitis dolore earum eligendi
              esse ratione temporibus vero voluptates. Delectus facilis, illum,
              labore nam nesciunt, nostrum numquam officia pariatur possimus
              quam quidem quos. Adipisci alias dolorem dolorum ea inventore
              laboriosam laudantium necessitatibus nobis quos suscipit? Culpa
              deserunt explicabo nobis odio vitae voluptate. Eaque, eveniet,
              rerum.
            </p>
            <p className="lead">
              Ab alias, at beatae commodi cumque cupiditate dicta distinctio
              dolor doloribus earum eius eos, fugit harum in ipsum itaque labore
              maiores maxime modi mollitia necessitatibus provident quas ratione
              repellat, vel! Cumque ducimus est laudantium similique! A,
              cupiditate debitis deserunt dignissimos doloremque illo minima
              molestiae tempora tempore voluptate! Laboriosam, numquam,
              provident.
            </p>
            <p className="lead">
              Alias amet asperiores beatae debitis deleniti dolore eaque eius
              eos et eum exercitationem illo ipsam natus nobis odit optio porro
              quibusdam, repudiandae rerum saepe sit temporibus tenetur vitae
              voluptatem voluptatibus. Aperiam, dignissimos iste? Blanditiis
              corporis cumque debitis, ea, fugiat ipsam, itaque maiores nobis
              non odit officia sint tempore voluptatibus? Sit!
            </p>
            <p className="lead">
              Aliquid, asperiores illo illum mollitia nihil numquam obcaecati
              voluptatibus. Accusamus ad atque commodi consectetur debitis,
              dignissimos dolor dolorum et explicabo harum illum inventore
              laboriosam magni non, numquam obcaecati officia placeat quam
              repellendus tempore, unde voluptatem voluptates. Animi delectus
              dolorem ea enim eveniet ex fugiat iure, magnam numquam provident
              qui tempore?
            </p>
            <p className="lead">
              Aperiam culpa ex laboriosam mollitia nemo, placeat praesentium
              provident voluptates? Aperiam autem cum dolore illo laboriosam
              molestiae quia quis similique sit ut. Beatae culpa dolorem, ea
              eaque eligendi eos, est illum inventore iusto labore magnam maxime
              neque nostrum pariatur porro quas quis rem rerum sint sit
              temporibus tenetur, velit voluptate.
            </p>
            <p className="lead">
              Aliquid corporis deleniti, dignissimos est magnam recusandae
              repellendus sit ut veniam? Accusamus beatae consequuntur cum
              delectus distinctio eaque eius fugit, harum minus modi officiis
              quasi quibusdam quisquam quo quod, sapiente sed ullam voluptas,
              voluptates voluptatibus! Consequatur expedita laudantium
              praesentium quia soluta? Enim, et exercitationem fugit laboriosam
              necessitatibus porro recusandae voluptatibus?
            </p>
            <p className="lead">
              Ab eum laudantium nobis qui quis. Alias aperiam aspernatur
              consequuntur eveniet ex, ipsa iste itaque minus molestiae mollitia
              officia sapiente ullam voluptates. Aliquid aperiam autem beatae
              dolore, est nihil numquam placeat quia quidem voluptatum! A
              deserunt distinctio, error, hic illo iure molestias nobis numquam
              porro similique soluta suscipit ut voluptatem.
            </p>
            <p className="lead">
              Amet atque autem corporis culpa cum cupiditate deleniti dicta
              dolores esse est eum explicabo fuga incidunt, labore magni maiores
              minima minus nemo nihil perspiciatis quae quaerat qui quisquam,
              quos reiciendis rem repellat similique totam, vero voluptates.
              Accusamus aliquam commodi consectetur cupiditate delectus ducimus
              neque quas ratione rerum sequi, voluptate, voluptates?
            </p>
            <p className="lead">
              Atque consequuntur deleniti deserunt dignissimos ducimus eveniet,
              magnam odio officia reiciendis rerum temporibus, ut voluptatem? A
              accusantium ad animi aut autem consequuntur cum dignissimos
              doloremque doloribus dolorum eligendi enim ex expedita facere
              facilis harum ipsa iste nihil nisi nobis odit, officiis possimus
              quod ratione rem repudiandae tempore temporibus velit voluptatem.
            </p>
            <p className="lead">
              Accusantium aperiam asperiores dolor dolores doloribus et, facere
              impedit laudantium nam neque, nihil odit possimus ratione rem
              repudiandae sed veniam! Doloribus eius, error fugit hic, impedit
              libero maiores necessitatibus omnis placeat quas quasi soluta ut
              voluptate. Alias animi beatae doloremque eveniet hic illo nam
              nobis numquam porro, totam. Et, impedit?
            </p>
            <p className="lead">
              Aut consequatur corporis dicta dolores doloribus eaque, earum
              eveniet explicabo laboriosam maiores natus, nihil possimus sed!
              Accusantium alias at cum ipsum obcaecati, pariatur qui rem
              reprehenderit rerum, saepe sapiente sed, veniam vero. Adipisci,
              autem cupiditate dolor eius error et exercitationem iusto nam
              natus non obcaecati odio perferendis, tempora tenetur, voluptatum!
            </p>
          </section>
        </main>
      </div>
    );
  }
}

export default Layout;
