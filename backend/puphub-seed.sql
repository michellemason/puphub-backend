INSERT INTO users (username, 
                    password, 
                    first_name, 
                    last_name, 
                    email, 
                    is_admin)
VALUES ('test',
        '$2b$12$30uGDn0kBZ/HfIVWnHBxVO1IzzIngYi7ylh8xFAcJ33dQygXmlGTm',
        'Ftest',
        'Ltest',
        'emailtest@test.com',
        FALSE),
        ('michelle',
        'password',
        'Michelle', 
        'Mason',
        'michelle@gmail.com',
        FALSE);

INSERT INTO dogs (name,
                age,
                breed,
                gender,
                image,
                user_id)
VALUES ('Walnut', '2', 'Collie', 'Male', 'https://image.petmd.com/files/styles/863x625/public/2022-10/collie-dog.jpg', 'test'),
('Winston', '5', 'Bernese Mountain Dog', 'Male', 'https://images.prismic.io/luko/5f372e3d-fcad-4557-8c68-7a4175954265_Bernese-Mountain-Dog-1.jpg', 'test'),
('Whiskey', '7', 'Black Lab', 'Male', 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Black_Labrador_Retriever_portrait.jpg/600px-Black_Labrador_Retriever_portrait.jpg', 'test')
